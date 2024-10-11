import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import uuid
import FullCalendar from "@fullcalendar/react"; // FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week and day views
import interactionPlugin from "@fullcalendar/interaction"; // Enables drag and drop
import EventForm from "./EventForm";
// API calls
import { getEvents, createEvent, updateEvent, deleteEvent } from "./api";

function Calendar() {
	// Initial events state
	const [events, setEvents] = useState([]);
	// state tracking if currently editing
	const [editingEvent, setEditingEvent] = useState(null);
	// Track if the event is new
	const [isNewEvent, setIsNewEvent] = useState(false);
	let lastClickTime = 0;
	// Fetch events on component mount
	useEffect(() => {
		const fetchEvents = async () => {
			const fetchedEvents = await getEvents();

			setEvents(fetchedEvents);
		};

		fetchEvents();
	}, []);

	// Handle event click double-click
	const handleEventClick = (clickInfo) => {
		const currentTime = new Date().getTime();
		// Check if last click was less than 300ms ago (for double-click detection)
		if (currentTime - lastClickTime < 300) {
			const eventToEdit = events.find(
				(event) => event.id === clickInfo.event.id // FullCalendar Use 'id'
			);
			console.log("Double Clicked Event:", clickInfo.event);
			setEditingEvent(eventToEdit);
			setIsNewEvent(false); // Not a new event
		}
		lastClickTime = currentTime; // Update last click time
	};

	// Handle form submission
	const handleFormSubmit = async (updatedEvent) => {
		console.log("Submitting Event:", updatedEvent);
		if (isNewEvent) {
			//create new event
			await createEvent(updatedEvent);
		} else if (editingEvent && editingEvent.id) {
			// Update existing event
			await updateEvent(editingEvent.id, updatedEvent);
		}

		const fetchedEvents = await getEvents();
		setEvents(fetchedEvents);
		//reset states
		setEditingEvent(null);
		setIsNewEvent(false);
	};

	// Delete event
	const handleDelete = async () => {
		if (editingEvent && editingEvent.id) {
			await deleteEvent(editingEvent.id); // Use event.id for deletion
		}
		setEvents(events.filter((event) => event.id !== editingEvent.id));
		setEditingEvent(null);
	};

	// Handle form cancellation
	const handleCancel = () => {
		if (isNewEvent) {
			setEvents(events.filter((event) => event.id !== editingEvent.id)); // Remove new event
		}
		setEditingEvent(null);
		setIsNewEvent(false);
	};

	// add new events by double-clicking on date

	const handleDateClick = (dateClickInfo) => {
		const currentTime = new Date().getTime();
		// Check if last click was less than 300ms ago
		if (currentTime - lastClickTime < 300) {
			const startDate = new Date(dateClickInfo.dateStr + "T00:00:00"); // Get the clicked date
			const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour later

			const newEvent = {
				id: uuidv4(), // generate id for new events
				title: "New Event",
				start: startDate.toISOString(),
				end: endDate.toISOString(),
			};

			console.log("New Event Object:", newEvent);
			console.log("Start:", newEvent.start);
			console.log("End:", newEvent.end);
			console.log("Title:", newEvent.title);

			setEvents([...events, newEvent]);
			setEditingEvent(newEvent);
			setIsNewEvent(true); // Mark as new event
		}

		lastClickTime = currentTime; // Update last click time
	};

	// Handle event drop or resize
	const handleEventChange = async (changedEvent) => {
		const updatedEvent = {
			...changedEvent.event,
			start: changedEvent.event.start.toISOString(), //make date format consistent
			end: changedEvent.event.end
				? changedEvent.event.end.toISOString()
				: null,
		};

		try {
			await updateEvent(changedEvent.event.id, updatedEvent);
			setEvents((prevEvents) =>
				prevEvents.map((event) =>
					event.id === changedEvent.event.id ? updatedEvent : event
				)
			);
		} catch (error) {
			console.error("Error updating event:", error);
		}
	};

	return (
		<div className="main-section">
			<div className="calendar-section">
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth" // Default view
					events={events} // Events to display
					dateClick={handleDateClick} // Action on date click
					eventClick={handleEventClick} // Action on event click
					editable={true} // Enable drag-and-drop
					selectable={true} // Enable date selection
					eventChange={handleEventChange} // Handle drag-and-drop or resize changes
					timeZone="local"
					headerToolbar={{
						// Customize header
						left: "prev,next today",
						center: "title",
						right: "dayGridMonth,timeGridWeek,timeGridDay",
					}}
				/>
				{editingEvent && (
					<div className="form-overlay">
						<div className="form-container">
							<EventForm
								event={editingEvent}
								onSubmit={handleFormSubmit}
								onDelete={handleDelete}
								onCancel={handleCancel}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

export default Calendar;
