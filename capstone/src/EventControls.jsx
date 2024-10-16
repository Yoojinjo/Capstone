import React from "react";

function EventControls({ selectedDate, handleDateChange, handleAddEvents }) {
	return (
		<div className="event-controls">
			<label>
				Select Transplant Date:{" "}
				<input
					type="date"
					value={selectedDate || ""}
					onChange={handleDateChange}
				/>
			</label>
			<button onClick={handleAddEvents}>Schedule Tomato Planting</button>
		</div>
	);
}

export default EventControls;
