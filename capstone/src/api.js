// src/api.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // Change to your server URL if deployed

export const saveFrostDates = async (firstFrost, lastFrost, userEmail) => {
	try {
		const response = await axios.post("/api/frost-dates", {
			firstFrost,
			lastFrost,
			userEmail,
		});
		return response.data; // Assuming the backend sends back the saved data or a success message
	} catch (error) {
		console.error("Error saving frost dates:", error);
		throw error; // Rethrow the error for further handling in the caller function
	}
};

export const getFrostDates = async (userEmail) => {
	try {
		const response = await axios.get(
			`${API_URL}/frostDates?userEmail=${encodeURIComponent(userEmail)}`
		); // Pass userEmail
		return response.data;
	} catch (error) {
		console.error("Error fetching frost dates:", error);
		throw error;
	}
};

export const getEvents = async (userEmail) => {
	const response = await axios.get(
		`${API_URL}/events?userEmail=${encodeURIComponent(userEmail)}`
	); // Pass userEmail
	return response.data;
};

export const createEvent = async (event, userEmail) => {
	console.log(event);
	console.log(userEmail);
	const response = await axios.post(`${API_URL}/events`, {
		id: event.id,
		groupId: event.groupId,
		title: event.title,
		start: event.start,
		end: event.end,
		userEmail: userEmail, // Include userEmail
	});
	return response.data;
};

export const updateEvent = async (id, event) => {
	const response = await axios.put(`${API_URL}/events/${id}`, event);
	return response.data;
};

export const deleteEvent = async (id) => {
	const response = await axios.delete(`${API_URL}/events/${id}`);
	return response.data;
};
