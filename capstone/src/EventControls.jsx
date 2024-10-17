import React from "react";
import AddTomatoEvents from "./AddTomatoEvents";
function EventControls({
	selectedDate,
	handleDateChange,
	events,
	setEvents,
	userEmail,
}) {
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
				userEmail={userEmail}
			/>
		</div>
	);
}

export default EventControls;
