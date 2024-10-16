import React, { useState, useEffect } from "react";

function FrostDateForm({
	handleSaveFrostDates,
	initialFirstFrost,
	initialLastFrost,
}) {
	const [firstFrost, setFirstFrost] = useState(initialFirstFrost || "");
	const [lastFrost, setLastFrost] = useState(initialLastFrost || "");

	// Update state when initial props change
	useEffect(() => {
		setFirstFrost(initialFirstFrost || "");
		setLastFrost(initialLastFrost || "");
	}, [initialFirstFrost, initialLastFrost]);

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		handleSaveFrostDates(firstFrost, lastFrost); // Pass the dates to the parent handler
	};

	return (
		<div className="frost-date-form">
			<form onSubmit={handleSubmit}>
				<label>
					First Frost Date:
					<input
						type="date"
						value={firstFrost}
						onChange={(e) => setFirstFrost(e.target.value)}
						required
					/>
				</label>
				<label>
					Last Frost Date:
					<input
						type="date"
						value={lastFrost}
						onChange={(e) => setLastFrost(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Save Frost Dates</button>
			</form>
		</div>
	);
}

export default FrostDateForm;
