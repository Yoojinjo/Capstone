import { useState } from "react";
import { updateEvent, deleteEvent } from "./api";

const useEventHandlers = (
	events,
	setEvents,
	setEditingEvent,
	setDirectionsVisible
) => {
	const [selectedDate, setSelectedDate] = useState(null);

	// Handle when a date is clicked on the calendar
	const handleDateClick = (dateClickInfo) => {
		const clickedDate = new Date(dateClickInfo.dateStr)
			.toISOString()
			.substring(0, 10);
		setSelectedDate(clickedDate);
	};

	// Handle when an event is changed (dragged or resized)
	const handleEventChange = async (changeInfo) => {
		const updatedEvent = {
			id: changeInfo.event.id,
			title: changeInfo.event.title,
			start: changeInfo.event.start.toISOString(),
			end: changeInfo.event.end
				? changeInfo.event.end.toISOString()
				: null,
		};
		try {
			await updateEvent(updatedEvent.id, updatedEvent);
			setEvents((prevEvents) =>
				prevEvents.map((event) =>
					event.id === updatedEvent.id ? updatedEvent : event
				)
			);
		} catch (error) {
			console.error("Error updating event:", error);
		}
	};

	// Handle when an event is clicked
	const handleEventClick = (clickInfo) => {
		const clickedEvent = events.find(
			(event) => event.id === clickInfo.event.id
		);
		setEditingEvent(clickedEvent);
		setDirectionsVisible(false); // Hide directions when editing
	};

	// Handle form submission for updating an event
	const handleFormSubmit = async (event, editingEvent) => {
		event.preventDefault();
		try {
			await updateEvent(editingEvent.id, editingEvent);
			setEvents((prevEvents) =>
				prevEvents.map((ev) =>
					ev.id === editingEvent.id ? editingEvent : ev
				)
			);
			setEditingEvent(null);
			setDirectionsVisible(true); // Show directions again
		} catch (error) {
			console.error("Error updating event:", error);
		}
	};

	// Handle deleting an event or group of events
	const handleDelete = async (editingEvent) => {
		if (!editingEvent || !editingEvent.id) {
			console.error("No editingEvent or ID provided for deletion");
			return;
		}
		const { groupId } = editingEvent;
		const eventsToDelete = groupId
			? events.filter((event) => event.groupId === groupId)
			: [editingEvent]; // If no groupId, just delete the single event

		try {
			await Promise.all(
				eventsToDelete.map((event) => deleteEvent(event.id))
			);
			setEvents((prevEvents) =>
				prevEvents.filter((event) => event.groupId !== groupId)
			);
			setEditingEvent(null);
			setDirectionsVisible(true); // Show directions again
		} catch (error) {
			console.error("Error deleting event(s):", error);
		}
	};

	return {
		selectedDate,
		setSelectedDate,
		handleDateClick,
		handleEventChange,
		handleEventClick,
		handleFormSubmit,
		handleDelete,
	};
};

export default useEventHandlers;
