import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Event from "./models/eventModel.js";

dotenv.config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Use environment variables for sensitive information

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log("MongoDB connected"))
	.catch((err) => console.error("Error connecting to MongoDB", err));

// Routes
app.get("/", (req, res) => {
	res.send("Welcome to the API");
});

// Get all events
app.get("/events", async (req, res) => {
	try {
		const events = await Event.find(); // Fetch events from MongoDB
		res.json(events);
	} catch (error) {
		res.status(500).send("Error fetching events");
	}
});

// Create a new event
app.post("/events", async (req, res) => {
	const { title, start, end } = req.body;

	const newEvent = new Event({
		title,
		start: new Date(start),
		end: new Date(end),
	});

	try {
		await newEvent.save();
		res.status(201).json(newEvent);
	} catch (error) {
		res.status(500).send("Error creating event");
	}
});

// Update an event
app.put("/events/:id", async (req, res) => {
	const { id } = req.params;
	const { title, start, end } = req.body;

	try {
		const updatedEvent = await Event.findByIdAndUpdate(
			id,
			{ title, start, end },
			{ new: true }
		);
		res.json(updatedEvent);
	} catch (error) {
		res.status(500).send("Error updating event");
	}
});

// Delete an event
app.delete("/events/:id", async (req, res) => {
	const { id } = req.params;

	try {
		await Event.findByIdAndDelete(id);
		res.sendStatus(204); // No content
	} catch (error) {
		res.status(500).send("Error deleting event");
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
