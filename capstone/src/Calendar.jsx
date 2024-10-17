import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Import FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid/index.js"; // Month view
import timeGridPlugin from "@fullcalendar/timegrid/index.js"; // Week and day views
import interactionPlugin from "@fullcalendar/interaction/index.js"; // Drag and drop, selectable
import EventControls from "./EventControls";
import Directions from "./Directions";
import EventForm from "./EventForm";
import useEventHandlers from "./EventHandlers";
import { getEvents, getFrostDates } from "./api"; // Import API functions
import "./Calendar.css"; // Import styles

function Calendar({ frostDates, userEmail }) {
	const [events, setEvents] = useState([]);
	const [editingEvent, setEditingEvent] = useState(null);
	const [directionsVisible, setDirectionsVisible] = useState(true);

	// Use the custom event handler hook to manage event-related functionality
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

	// Log frost dates and user email for debugging
	useEffect(() => {
		console.log("Calendar component rendered");
		console.log(frostDates, userEmail); // Log the props to ensure they are passed correctly
	}, [frostDates, userEmail]);

	// Fetch events and frost dates from the backend when the component mounts
	useEffect(() => {
		const fetchAllEvents = async () => {
			const fetchedEvents = await getEvents(userEmail);
			const frostData = (await getFrostDates(userEmail))[0];

			console.log("Fetched Events:", fetchedEvents);
			console.log("Fetched Frost Dates:", frostData);

			const frostEvents = [
				{
					title: "Frost Dates",
					start: frostData.firstFrost.split("T")[0], // Extract only the date part
					end: frostData.lastFrost.split("T")[0],
					display: "background",
					backgroundColor: "darkblue",
					borderColor: "transparent",
				},
			];

			console.log("Frost Events:", frostEvents);
			setEvents([...fetchedEvents, ...frostEvents]); // Merge events and frost dates
		};

		fetchAllEvents();
	}, [userEmail]);

	// Handle the date change input
	const handleDateChange = (e) => {
		setSelectedDate(e.target.value);
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

	return (
		<div>
			{/* Date input and button to generate the events */}
			<EventControls
				selectedDate={selectedDate}
				handleDateChange={handleDateChange}
				events={events}
				setEvents={setEvents}
				userEmail={userEmail}
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
							right: "dayGridMonth",
						}} // Customize header buttons
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
							} // Pass event to submit function
							handleCancel={handleCancel}
							handleDelete={() => handleDelete(editingEvent)} // Pass event to delete function
						/>
					)}
				</div>
			</div>
		</div>
	);
}

export default Calendar;
