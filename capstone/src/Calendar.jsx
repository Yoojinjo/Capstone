import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid/index.js"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid/index.js"; // Week and day views
import interactionPlugin from "@fullcalendar/interaction/index.js"; // Drag and drop, selectable
import { v4 as uuidv4 } from "uuid"; // For generating unique event IDs

function Calendar() {
	// Initial events state
	const [events, setEvents] = useState([
		{
			id: uuidv4(),
			title: "Initial Event",
			start: new Date().toISOString(), // Set current time as start
			end: new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(), // End 1 hour later
			editable: true,
		},
	]);

	// State to manage the currently editing event
	const [editingEvent, setEditingEvent] = useState(null);

	// Handle date click (for creating new events)
	const handleDateClick = (dateClickInfo) => {
		const newEvent = {
			id: uuidv4(),
			title: "New Event",
			start: new Date(dateClickInfo.dateStr).toISOString(),
			end: new Date(
				new Date(dateClickInfo.dateStr).getTime() + 60 * 60 * 1000
			).toISOString(), // 1 hour later
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
		setEditingEvent(clickedEvent); // Set the event to be edited
	};

	// Handle form submission to save changes
	const handleFormSubmit = (e) => {
		e.preventDefault();
		const updatedEvents = events.map((event) =>
			event.id === editingEvent.id ? editingEvent : event
		);
		setEvents(updatedEvents); // Update event list
		setEditingEvent(null); // Close the form
	};

	// Handle form input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setEditingEvent((prev) => ({ ...prev, [name]: value }));
	};

	return (
		<div className="calendar-container">
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

			{/* Conditional rendering for the event editing form */}
			{editingEvent && (
				<div className="edit-event-modal">
					<h3>Edit Event</h3>
					<form onSubmit={handleFormSubmit}>
						<div>
							<label>Title:</label>
							<input
								type="text"
								name="title"
								value={editingEvent.title}
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label>Start:</label>
							<input
								type="datetime-local"
								name="start"
								value={editingEvent.start.replace("Z", "")} // Remove 'Z' for local time
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label>End:</label>
							<input
								type="datetime-local"
								name="end"
								value={editingEvent.end.replace("Z", "")} // Remove 'Z' for local time
								onChange={handleInputChange}
							/>
						</div>
						<button type="submit">Save Changes</button>
						<button
							type="button"
							onClick={() => setEditingEvent(null)}
						>
							Cancel
						</button>
					</form>
				</div>
			)}
		</div>
	);
}

export default Calendar;
