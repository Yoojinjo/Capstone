import React from "react";
import AddTomatoEvents from "./AddTomatoEvents";
function EventControls({ selectedDate, handleDateChange, events, setEvents }) {
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
			<AddTomatoEvents
				selectedDate={selectedDate}
				events={events}
				setEvents={setEvents}
			/>
		</div>
	);
}

export default EventControls;
