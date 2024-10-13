import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid/index.js"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid/index.js"; // Week and day views
import interactionPlugin from "@fullcalendar/interaction/index.js"; // Drag and drop, selectable
import { v4 as uuidv4 } from "uuid"; // For generating unique event IDs
import "./Calendar.css";
import Directions from "./Directions";
import EventForm from "./EventForm";
import { getEvents, createEvent, updateEvent, deleteEvent } from "./api";

function Calendar() {
	const [events, setEvents] = useState([]);
	const [editingEvent, setEditingEvent] = useState(null);
	const [directionsVisible, setDirectionsVisible] = useState(true);

	// Fetch events from the backend on component mount
	useEffect(() => {
		const fetchEvents = async () => {
			const fetchedEvents = await getEvents();
			setEvents(fetchedEvents);
		};

		fetchEvents();
	}, []);

	// Handle date click (for creating new events)
	const handleDateClick = (dateClickInfo) => {
		// Create a Date object representing 8 AM UTC on the clicked date
		const selectedDate = new Date(dateClickInfo.dateStr + "T08:00:00Z"); // Use UTC time

		const newEvent = {
			id: uuidv4(),
			title: "New Event",
			start: selectedDate.toISOString(), // Start time in UTC
			end: new Date(
				selectedDate.getTime() + 60 * 60 * 1000
			).toISOString(), // End 1 hour later
			editable: true, // Allow event to be dragged or resized
		};

		setEvents([...events, newEvent]);
	};

	// Handle event drop/resize (when events are dragged or resized)
	const handleEventChange = (changeInfo) => {
		const updatedEvents = events.map((event) =>
			event.id === changeInfo.event.id
				? {
						...event,
						start: changeInfo.event.start.toISOString(),
						end: changeInfo.event.end
							? changeInfo.event.end.toISOString()
							: null,
				  }
				: event
		);

		setEvents(updatedEvents);
	};

	// Handle event click (for further interactions like editing)
	const handleEventClick = (clickInfo) => {
		const clickedEvent = events.find(
			(event) => event.id === clickInfo.event.id
		);
		console.log("Clicked Event:", clickedEvent);
		setEditingEvent(clickedEvent);
		setDirectionsVisible(false); // Hide directions when editing
	};

	// Handle form submission to save changes
	const handleFormSubmit = (e) => {
		e.preventDefault();
		const updatedEvents = events.map((event) =>
			event.id === editingEvent.id ? editingEvent : event
		);
		setEvents(updatedEvents); // Update event list
		setEditingEvent(null); // Close the form
		setDirectionsVisible(true); // Show directions again after saving
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditingEvent((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form cancel
	const handleCancel = () => {
		setEditingEvent(null); // Close the form
		setDirectionsVisible(true); // Show directions again
	};

	// delete event
	const handleDelete = () => {
		setEvents(events.filter((event) => event.id !== editingEvent.id)); // Remove the event from the events array
		setEditingEvent(null);
		setDirectionsVisible(true);
	};

	return (
		<div className="calendar-container">
			<div className="calendar">
				<FullCalendar
					plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
					initialView="dayGridMonth" // Default view: month
					events={events} // Display events
					dateClick={handleDateClick} // Click on a date to add a new event
					eventClick={handleEventClick} // Click on an event to trigger an action
					editable={true} // Allow event drag-and-drop
					eventChange={handleEventChange} // Handle event updates
					selectable={true} // Allow date range selection
					headerToolbar={{
						left: "prev,next today",
						center: "title",
						right: "dayGridMonth,timeGridWeek,timeGridDay",
					}} // Customize header buttons
					height="auto" // Adjust calendar height to fit content
				/>
			</div>

			{/* Conditional rendering for direction or the event editing form */}
			<div className="info-section">
				{directionsVisible ? (
					<Directions />
				) : (
					<EventForm
						editingEvent={editingEvent}
						handleInputChange={handleInputChange}
						handleFormSubmit={handleFormSubmit}
						handleCancel={handleCancel}
						handleDelete={handleDelete}
					/>
				)}
			</div>
		</div>
	);
}

export default Calendar;
