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

// POST /events - Create a new event
app.post("/events", async (req, res) => {
	const { id, title, start, end } = req.body;

	try {
		const newEvent = new Event({ id, title, start, end }); // id provided by the client
		await newEvent.save(); // Save to MongoDB
		res.status(201).json(newEvent);
	} catch (error) {
		console.error("Error saving event:", error);
		res.status(500).json({ error: error.message });
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
		const deletedEvent = await Event.findByIdAndDelete(id);

		if (!deletedEvent) {
			return res.status(404).send("Event not found");
		}

		res.status(200).json({ message: "Event deleted successfully" });
	} catch (error) {
		res.status(500).send("Error deleting event");
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
