// EventHandlers.js
import { useState } from "react";
import { updateEvent, deleteEvent } from "./api";

const useEventHandlers = (
	events,
	setEvents,
	setEditingEvent,
	setDirectionsVisible
) => {
	const [selectedDate, setSelectedDate] = useState(null);

	const handleDateClick = (dateClickInfo) => {
		const clickedDate = new Date(dateClickInfo.dateStr)
			.toISOString()
			.substring(0, 10);
		setSelectedDate(clickedDate);
	};

	const handleEventChange = async (changeInfo) => {
		const updatedEvent = {
			id: changeInfo.event.id,
			title: changeInfo.event.title,
			start: changeInfo.event.start.toISOString(),
			end: changeInfo.event.end
				? changeInfo.event.end.toISOString()
				: null,
		};
		await updateEvent(updatedEvent.id, updatedEvent);
		setEvents((prevEvents) =>
			prevEvents.map((event) =>
				event.id === updatedEvent.id ? updatedEvent : event
			)
		);
	};

	const handleEventClick = (clickInfo) => {
		const clickedEvent = events.find(
			(event) => event.id === clickInfo.event.id
		);
		setEditingEvent(clickedEvent);
		setDirectionsVisible(false);
	};

	const handleFormSubmit = async (editingEvent) => {
		const updatedEvents = events.map((event) =>
			event.id === editingEvent.id ? editingEvent : event
		);
		await updateEvent(editingEvent.id, editingEvent);
		setEvents(updatedEvents);
		setEditingEvent(null);
		setDirectionsVisible(true);
	};

	const handleDelete = async (editingEvent) => {
		if (!editingEvent) return;
		const { groupId } = editingEvent;
		const eventsToDelete = events.filter(
			(event) => event.groupId === groupId
		);
		await Promise.all(eventsToDelete.map((event) => deleteEvent(event.id)));
		setEvents(events.filter((event) => event.groupId !== groupId));
		setEditingEvent(null);
		setDirectionsVisible(true);
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
