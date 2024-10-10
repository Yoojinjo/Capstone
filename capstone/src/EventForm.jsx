import React, { useState } from "react";

const EventForm = ({ event, onSubmit, onDelete, onCancel }) => {
	const [title, setTitle] = useState(event.title);

	const handleSubmit = (e) => {
		e.preventDefault();
		onSubmit({ ...event, title });
	};
	const handleDelete = () => {
		onDelete(event._id); // Call the delete function with the event id
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<label>Title:</label>
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>
			<button type="submit">Save</button>{" "}
			<button type="button" onClick={handleDelete}>
				Delete Event
			</button>
			<button type="button" onClick={onCancel}>
				Cancel
			</button>
		</form>
	);
};

export default EventForm;
