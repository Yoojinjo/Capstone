// src/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/events"; // Change to your server URL if deployed

export const getEvents = async () => {
	const response = await axios.get(API_URL);
	return response.data;
};

export const createEvent = async (event) => {
	const response = await axios.post(API_URL, {
		id: event.id,
		title: event.title,
		start: event.start,
		end: event.end,
		startEditable: true,
		durationEditable: true,
	});
	return response.data;
};

export const updateEvent = async (id, event) => {
	const response = await axios.put(`${API_URL}/${id}`, event);
	return response.data;
};

export const deleteEvent = async (id) => {
	await axios.delete(`${API_URL}/${id}`);
};
