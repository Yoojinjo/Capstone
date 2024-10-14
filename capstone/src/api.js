// src/api.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // Change to your server URL if deployed

export const getEvents = async () => {
	const response = await axios.get(`${API_URL}/events`);
	return response.data;
};

export const createEvent = async (event) => {
	const response = await axios.post(`${API_URL}/events`, {
		id: event.id,
		groupId: event.groupId,
		title: event.title,
		start: event.start,
		end: event.end,
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
