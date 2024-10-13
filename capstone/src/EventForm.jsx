function EventForm({
	editingEvent,
	handleInputChange,
	handleFormSubmit,
	handleCancel,
}) {
	return (
		<div className="edit-event-modal">
			<h3>Edit Event</h3>
			<form onSubmit={handleFormSubmit}>
				<div>
					<label>Title:</label>
					<input
						type="text"
						name="title"
						value={editingEvent.title || ""}
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>Start:</label>
					<input
						type="datetime-local"
						name="start"
						value={
							editingEvent.start
								? editingEvent.start.replace("Z", "")
								: ""
						} // Remove 'Z' for local time
						onChange={handleInputChange}
					/>
				</div>
				<div>
					<label>End:</label>
					<input
						type="datetime-local"
						name="end"
						value={editingEvent.end.replace("Z", "")} // Remove 'Z' for local time
						onChange={handleInputChange}
					/>
				</div>
				<button type="submit">Save Changes</button>
				<button type="button" onClick={handleCancel}>
					Cancel
				</button>
			</form>
		</div>
	);
}

export default EventForm;
