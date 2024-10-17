// AddTomatoEvents.js
import React from "react";
import { v4 as uuidv4 } from "uuid"; // For generating unique event IDs
import { createEvent } from "./api"; // Import the createEvent API function

const AddTomatoEvents = ({ selectedDate, events, setEvents, userEmail }) => {
	const handleAddEvents = async () => {
		if (!selectedDate) {
			alert("Please select a date for the Tomato Transplant event.");
			return;
		}

		// Create a Date object for the transplant event at 8 AM UTC
		const transplantDate = new Date(selectedDate + "T08:00:00Z");
		const groupIdValue = uuidv4(); // Create a unique group ID for these events
		console.log("AddTomatoEvents userEmail:", userEmail); // Check the prop here

		// Create the 'Tomato Transplant' event
		const transplantEvent = {
			id: uuidv4(),
			groupId: groupIdValue,
			title: "Transplant - Tomatoes",
			start: transplantDate.toISOString(),
			end: new Date(
				transplantDate.getTime() + 24 * 60 * 60 * 1000
			).toISOString(), // 1-day event
			editable: true,
			userEmail: userEmail,
		};
		console.log(transplantEvent);
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
			).toISOString(), // 1-day event
			editable: true,
			userEmail: userEmail,
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
			).toISOString(), // 1-day event
			editable: true,
			userEmail: userEmail,
		};

		// Create events in the backend
		const createdTransplantEvent = await createEvent(
			transplantEvent,
			userEmail
		);
		const createdSeedStartEvent = await createEvent(
			seedStartEvent,
			userEmail
		);
		const createdHarvestEvent = await createEvent(harvestEvent, userEmail);

		// Update the events state with all three events
		setEvents([
			...events,
			createdTransplantEvent,
			createdSeedStartEvent,
			createdHarvestEvent,
		]);

		alert("Events have been added to the calendar!");
	};

	return <button onClick={handleAddEvents}>Add Tomatoes</button>;
};

export default AddTomatoEvents;
