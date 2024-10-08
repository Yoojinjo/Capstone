import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // FullCalendar component
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import timeGridPlugin from "@fullcalendar/timegrid"; // For week and day views
import interactionPlugin from "@fullcalendar/interaction"; // Enables drag and drop
import "./Calendar.css";
function Calendar() {
	// Initial events state
	const [events, setEvents] = useState([
		{
			title: "Start Seeds: Tomato",
			start: "2024-10-15T10:00:00",
			end: "2024-10-15T11:00:00",
		},
		{
			title: "Transplant: Tomato",
			start: "2024-10-16T12:00:00",
			end: "2024-10-16T13:00:00",
		},
	]);

	// Handle date click event
	const handleDateClick = (arg) => {
		const newEvent = { title: "New Event", start: arg.dateStr };
		setEvents([...events, newEvent]); // Add new event to state
	};

	return (
		<div>
			<FullCalendar
				plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
				initialView="dayGridMonth" // Default view
				events={events} // Events to display
				dateClick={handleDateClick} // Action on date click
				editable={true} // Enable drag-and-drop
				selectable={true} // Enable date selection
				headerToolbar={{
					// Customize header
					left: "prev,next today",
					center: "title",
					right: "dayGridMonth,timeGridWeek,timeGridDay",
				}}
			/>
		</div>
	);
}

export default Calendar;
