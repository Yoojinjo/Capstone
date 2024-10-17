import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid/index.js"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid/index.js"; // Week and day views
import interactionPlugin from "@fullcalendar/interaction/index.js"; // Drag and drop, selectable
import { v4 as uuidv4 } from "uuid"; // For generating unique event IDs
import EventControls from "./EventControls";
import Directions from "./Directions";
import EventForm from "./EventForm";
import useEventHandlers from "./EventHandlers";

import {
	getEvents,
	createEvent,
	updateEvent,
	deleteEvent,
	getFrostDates,
} from "./api";

import "./Calendar.css";

function Calendar({ frostDates, userEmail }) {
	const [events, setEvents] = useState([]);

	const [editingEvent, setEditingEvent] = useState(null);
	const [directionsVisible, setDirectionsVisible] = useState(true);
	const {
		selectedDate,
		setSelectedDate,
		handleDateClick,
		handleEventChange,
		handleEventClick,
		handleFormSubmit,
		handleDelete,
	} = useEventHandlers(
		events,
		setEvents,
		setEditingEvent,
		setDirectionsVisible
	);
	useEffect(() => {
		console.log("Calendar component rendered");
		console.log(frostDates, userEmail); // Log the props to make sure they are passed
	}, [frostDates, userEmail]);
	// Fetch events from the backend on component mount
	useEffect(() => {
		const fetchAllEvents = async () => {
			const fetchedEvents = await getEvents(userEmail);
			const frostDates = (await getFrostDates(userEmail))[0];

			console.log("Fetched Events:", fetchedEvents);
			console.log("Fetched Frost Dates:", frostDates);

			const frostEvents = [
				{
					title: "Frost Dates",
					start: frostDates.firstFrost.split("T")[0], // Get only the date part
					end: frostDates.lastFrost.split("T")[0], // Get only the date part
					display: "background",
					backgroundColor: "darkblue",
					borderColor: "transparent",
				},
			];
			console.log("Frost Events:", frostEvents);
			setEvents([...fetchedEvents, ...frostEvents]); // Merge all events
		};

		fetchAllEvents();
	}, [userEmail]);

	// // Handle date click (for selecting a transplant date)
	// const handleDateClick = (dateClickInfo) => {
	// 	// Update the selected date with the clicked date (in YYYY-MM-DD format)
	// 	const clickedDate = new Date(dateClickInfo.dateStr)
	// 		.toISOString()
	// 		.substring(0, 10);
	// 	setSelectedDate(clickedDate);
	// };

	// Set the selected date from the input
	const handleDateChange = (e) => {
		setSelectedDate(e.target.value);
	};

	// // Handle event drop/resize (when events are dragged or resized)
	// const handleEventChange = async (changeInfo) => {
	// 	const updatedEvent = {
	// 		id: changeInfo.event.id, // Use the event's unique ID
	// 		title: changeInfo.event.title,
	// 		start: changeInfo.event.start.toISOString(), // Ensure start time is in ISO format
	// 		end: changeInfo.event.end
	// 			? changeInfo.event.end.toISOString()
	// 			: null, // Ensure end time is in ISO format
	// 	};

	// 	// Update event in backend
	// 	await updateEvent(updatedEvent.id, updatedEvent);
	// 	setEvents((prevEvents) =>
	// 		prevEvents.map((event) =>
	// 			event.id === updatedEvent.id ? updatedEvent : event
	// 		)
	// 	);
	// };

	// // Handle event click (for further interactions like editing)
	// const handleEventClick = (clickInfo) => {
	// 	const clickedEvent = events.find(
	// 		(event) => event.id === clickInfo.event.id
	// 	);
	// 	console.log("Clicked Event:", clickedEvent);
	// 	setEditingEvent(clickedEvent);
	// 	setDirectionsVisible(false); // Hide directions when editing
	// };

	// // Handle form submission to save changes
	// const handleFormSubmit = async (e) => {
	// 	e.preventDefault();
	// 	const updatedEvents = events.map((event) =>
	// 		event.id === editingEvent.id ? editingEvent : event
	// 	);

	// 	// Update the event in the backend
	// 	await updateEvent(editingEvent.id, editingEvent);
	// 	setEvents(updatedEvents);
	// 	setEditingEvent(null);
	// 	setDirectionsVisible(true);
	// };

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

	// // delete event and related events sharing the same groupId
	// const handleDelete = async () => {
	// 	if (!editingEvent) return; // Ensure there is an event to delete

	// 	const { groupId } = editingEvent;

	// 	// Filter the events to get all events with the same groupId
	// 	const eventsToDelete = events.filter(
	// 		(event) => event.groupId === groupId
	// 	);

	// 	// Delete all events with the same groupId from the backend
	// 	await Promise.all(eventsToDelete.map((event) => deleteEvent(event.id)));

	// 	// Update the state by removing the deleted events
	// 	setEvents(events.filter((event) => event.groupId !== groupId));

	// 	// Clear the editing form and show directions again
	// 	setEditingEvent(null);
	// 	setDirectionsVisible(true);
	// };

	return (
		<div>
			{/* Date input and button to generate the events */}
			<EventControls
				selectedDate={selectedDate}
				handleDateChange={handleDateChange}
				events={events}
				setEvents={setEvents}
			/>

			<div className="calendar-container">
				<div className="calendar">
					<FullCalendar
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							interactionPlugin,
						]}
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
						// dayCellDidMount={dayCellDidMount} //  custom class for frost dates
						height="auto" // Adjust calendar height to fit content
					/>
				</div>

				{/* Conditional rendering for directions or the event editing form */}
				<div className="info-section">
					{directionsVisible ? (
						<Directions />
					) : (
						<EventForm
							editingEvent={editingEvent}
							handleInputChange={handleInputChange}
							handleFormSubmit={() =>
								handleFormSubmit(editingEvent)
							}
							handleCancel={handleCancel}
							handleDelete={() => handleDelete(editingEvent)}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Calendar;
