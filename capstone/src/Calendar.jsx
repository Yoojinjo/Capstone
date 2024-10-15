import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid/index.js"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid/index.js"; // Week and day views
import interactionPlugin from "@fullcalendar/interaction/index.js"; // Drag and drop, selectable
import { v4 as uuidv4 } from "uuid"; // For generating unique event IDs

import Directions from "./Directions";
import EventForm from "./EventForm";
import { getEvents, createEvent, updateEvent, deleteEvent } from "./api";
import "./Calendar.css";

function Calendar() {
	const [events, setEvents] = useState([]);
	const [selectedDate, setSelectedDate] = useState(null);
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

	// Handle date click (for selecting a transplant date)
	const handleDateClick = (dateClickInfo) => {
		// Update the selected date with the clicked date (in YYYY-MM-DD format)
		const clickedDate = new Date(dateClickInfo.dateStr)
			.toISOString()
			.substring(0, 10);
		setSelectedDate(clickedDate);
	};

	const frostDates = [
		{
			start: "2024-10-14",
			end: "2025-05-03",
			display: "background",
			backgroundColor: "darkblue", // Frost highlight color
			borderColor: "transparent", // Optional: Remove border for background event
		},
	];

	// Function to add the 'Tomato Transplant', 'Seed Start', and 'First Tomato Harvest' events
	const handleAddEvents = async () => {
		if (!selectedDate) {
			alert("Please select a date for the Tomato Transplant event.");
			return;
		}

		// Create a Date object for the transplant event at 8 AM UTC
		const transplantDate = new Date(selectedDate + "T08:00:00Z");
		const groupIdValue = uuidv4(); // Create a unique group ID for these events

		// Create the 'Tomato Transplant' event
		const transplantEvent = {
			id: uuidv4(),
			groupId: groupIdValue,
			title: "Transplant - Tomatoes",
			start: transplantDate.toISOString(),
			end: new Date(
				transplantDate.getTime() + 24 * 60 * 60 * 1000
			).toISOString(), // 1-hour event
			editable: true,
		};

		// Generate the 'Seed Start' event, 6 weeks (42 days) before the transplant
		const seedStartDate = new Date(
			transplantDate.getTime() - 42 * 24 * 60 * 60 * 1000
		); // Subtract 6 weeks (42 days)
		const seedStartEvent = {
			id: uuidv4(),
			groupId: groupIdValue,
			title: "Seed Start - Tomatoes",
			start: seedStartDate.toISOString(),
			end: new Date(
				seedStartDate.getTime() + 24 * 60 * 60 * 1000
			).toISOString(), // 1-hour event
			editable: true,
		};

		// Generate the 'First Tomato Harvest' event, 6 weeks (42 days) after the transplant
		const harvestDate = new Date(
			transplantDate.getTime() + 42 * 24 * 60 * 60 * 1000
		); // Add 6 weeks (42 days)
		const harvestEvent = {
			id: uuidv4(),
			groupId: groupIdValue,
			title: "First Harvest - Tomatoes",
			start: harvestDate.toISOString(),
			end: new Date(
				harvestDate.getTime() + 24 * 60 * 60 * 1000
			).toISOString(), // 1-hour event
			editable: true,
		};

		// Create events in backend
		const createdTransplantEvent = await createEvent(transplantEvent);
		const createdSeedStartEvent = await createEvent(seedStartEvent);
		const createdHarvestEvent = await createEvent(harvestEvent);

		// Update the events state with all three events
		setEvents([
			...events,
			createdTransplantEvent,
			createdSeedStartEvent,
			createdHarvestEvent,
		]);

		alert("Events have been added to the calendar!");
	};

	// Set the selected date from the input
	const handleDateChange = (e) => {
		setSelectedDate(e.target.value);
	};

	// Handle event drop/resize (when events are dragged or resized)
	const handleEventChange = async (changeInfo) => {
		const updatedEvent = {
			id: changeInfo.event.id, // Use the event's unique ID
			title: changeInfo.event.title,
			start: changeInfo.event.start.toISOString(), // Ensure start time is in ISO format
			end: changeInfo.event.end
				? changeInfo.event.end.toISOString()
				: null, // Ensure end time is in ISO format
		};

		// Update event in backend
		await updateEvent(updatedEvent.id, updatedEvent);
		setEvents((prevEvents) =>
			prevEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			)
		);
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
	const handleFormSubmit = async (e) => {
		e.preventDefault();
		const updatedEvents = events.map((event) =>
			event.id === editingEvent.id ? editingEvent : event
		);

		// Update the event in the backend
		await updateEvent(editingEvent.id, editingEvent);
		setEvents(updatedEvents);
		setEditingEvent(null);
		setDirectionsVisible(true);
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

	// // delete event
	// const handleDelete = async () => {
	// 	await deleteEvent(editingEvent.id);
	// 	setEvents(events.filter((event) => event.id !== editingEvent.id));
	// 	setEditingEvent(null);
	// 	setDirectionsVisible(true);
	// };

	// delete event and related events sharing the same groupId
	const handleDelete = async () => {
		if (!editingEvent) return; // Ensure there is an event to delete

		const { groupId } = editingEvent;

		// Filter the events to get all events with the same groupId
		const eventsToDelete = events.filter(
			(event) => event.groupId === groupId
		);

		// Delete all events with the same groupId from the backend
		await Promise.all(eventsToDelete.map((event) => deleteEvent(event.id)));

		// Update the state by removing the deleted events
		setEvents(events.filter((event) => event.groupId !== groupId));

		// Clear the editing form and show directions again
		setEditingEvent(null);
		setDirectionsVisible(true);
	};

	return (
		<div>
			{/* Date input and button to generate the events */}

			<div className="event-controls">
				<label>
					Select Transplant Date:{" "}
					<input
						type="date"
						value={selectedDate || ""}
						onChange={handleDateChange}
					/>
				</label>
				<button onClick={handleAddEvents}>
					Schedule Tomato Planting
				</button>
			</div>
			<div className="calendar-container">
				<div className="calendar">
					<FullCalendar
						plugins={[
							dayGridPlugin,
							timeGridPlugin,
							interactionPlugin,
						]}
						initialView="dayGridMonth" // Default view: month
						events={[...events, ...frostDates]} // Display events
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
							handleFormSubmit={handleFormSubmit}
							handleCancel={handleCancel}
							handleDelete={handleDelete}
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Calendar;
