import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
	id: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	start: {
		type: Date,
		required: true,
	},
	end: {
		type: Date,
		required: true,
	},
});
const Event = mongoose.model("Event", eventSchema);
export default Event;
