import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week and day views
import interactionPlugin from "@fullcalendar/interaction"; // Enables drag and drop
import EventForm from "./EventForm";

function Calendar() {
	// Initial events state
	const [events, setEvents] = useState([
		{
			id: 1, // Add an id for the event
			title: "Tomato: Start Seeds",
			start: "2024-10-15T10:00:00",
			end: "2024-10-15T11:00:00",
		},
		{
			id: 2,
			title: "Tomato: Transplant",
			start: "2024-10-16T12:00:00",
			end: "2024-10-16T13:00:00",
		},
	]);

	const [editingEvent, setEditingEvent] = useState(null);

	// Handle event click
	const handleEventClick = (clickInfo) => {
		setEditingEvent(clickInfo.event); // Set the selected event to be edited
	};

	// Handle form submission
	const handleFormSubmit = (updatedEvent) => {
		const updatedEvents = events.map((event) =>
			event.id === updatedEvent.id ? updatedEvent : event
		);
		setEvents(updatedEvents);
		setEditingEvent(null); // Close the form
	};
	// Delete event
	const handleDelete = (eventId) => {
		setEvents(events.filter((event) => event.id !== eventId));
		setSelectedEvent(null); // Close the edit form
	};
	// Handle form cancellation
	const handleCancel = () => {
		setEditingEvent(null);
	};

	// add new events by double-clicking on date
	let lastClickTime = 0;

	const handleDateClick = (dateClickInfo) => {
		const currentTime = new Date().getTime();

		if (currentTime - lastClickTime < 300) {
			// Check if last click was less than 300ms ago
			const newEvent = {
				id: events.length + 1,
				title: "New Event",
				start: dateClickInfo.dateStr,
				end: new Date(dateClickInfo.dateStr).setHours(
					new Date(dateClickInfo.dateStr).getHours() + 1
				),
			};
			setEvents([...events, newEvent]);
		}

		lastClickTime = currentTime; // Update last click time
	};

	return (
		<div>
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
			{/* conditional render editing form */}
			{editingEvent && (
				<EventForm
					event={editingEvent}
					onSubmit={handleFormSubmit}
					onDelete={handleDelete}
					onCancel={handleCancel}
				/>
			)}
		</div>
	);
}

export default Calendar;
