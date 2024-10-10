import React, { useEffect, useState } from "react";
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

	// Fetch events on component mount
	useEffect(() => {
		const fetchEvents = async () => {
			const fetchedEvents = await getEvents();
			// Map MongoDB's _id to FullCalendar's id
			const mappedEvents = fetchedEvents.map((event) => ({
				...event,
				id: event._id, // FullCalendar expects 'id', map _id to id
			}));
			setEvents(mappedEvents);
		};

		fetchEvents();
	}, []);

	//	Hardcoded initial testing Placeholder
	// const [events, setEvents] = useState([
	// 	{
	// 		id: "1", // Add an id for the event
	// 		title: "Tomato: Start Seeds",
	// 		start: "2024-10-15T10:00:00",
	// 		end: "2024-10-15T11:00:00",
	// 	},
	// 	{
	// 		id: "2",
	// 		title: "Tomato: Transplant",
	// 		start: "2024-10-16T12:00:00",
	// 		end: "2024-10-16T13:00:00",
	// 	},
	// ]);

	// Handle event click
	const handleEventClick = (clickInfo) => {
		const eventToEdit = events.find(
			(event) => event.id === clickInfo.event.id // FullCalendar Use 'id'
		);
		setEditingEvent(eventToEdit);
		setIsNewEvent(false); // Not a new event
	};
	// change code to work with MONGODB id
	// const handleEventClick = (clickInfo) => {
	// 	console.log("Clicked Event:", clickInfo.event);
	// 	const eventToEdit = events.find(
	// 		(event) => event.id === clickInfo.event.id
	// 	); // convert the FullCalendar event object back to state format
	// 	console.log("Event to Edit:", eventToEdit);
	// 	setEditingEvent(eventToEdit); // Set the selected event to be edited
	// };

	// Handle form submission
	const handleFormSubmit = async (updatedEvent) => {
		if (editingEvent) {
			await updateEvent(editingEvent._id, updatedEvent); // MongoDB _id for updates
		} else {
			await createEvent(updatedEvent);
		}
		const fetchedEvents = await getEvents();
		// Map _id to id again after updating/creating
		const mappedEvents = fetchedEvents.map((event) => ({
			...event,
			id: event._id,
		}));
		setEvents(mappedEvents);
		setEditingEvent(null);
	};

	// const handleFormSubmit = (updatedEvent) => {
	// 	const updatedEvents = events.map((event) =>
	// 		event.id === updatedEvent.id ? updatedEvent : event
	// 	);
	// 	setEvents(updatedEvents);
	// 	setEditingEvent(null); // Close the form
	// };

	// Delete event
	const handleDelete = async (eventId) => {
		await deleteEvent(eventId);
		setEvents(events.filter((event) => event._id !== eventId));
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
	let lastClickTime = 0;

	const handleDateClick = (dateClickInfo) => {
		const currentTime = new Date().getTime();
		// Check if last click was less than 300ms ago
		if (currentTime - lastClickTime < 300) {
			const newEvent = {
				id: `temp-${events.length + 1}`, // Temporary id for new events
				title: "New Event",
				start: dateClickInfo.dateStr,
				end: new Date(dateClickInfo.dateStr).setHours(
					new Date(dateClickInfo.dateStr).getHours() + 1
				),
			};
			setEvents([...events, newEvent]);
			setEditingEvent(newEvent);
			setIsNewEvent(true); // Mark as new event
		}

		lastClickTime = currentTime; // Update last click time
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
								onDelete={() => handleDelete(editingEvent.id)}
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
