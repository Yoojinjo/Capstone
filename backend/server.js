import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
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

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
