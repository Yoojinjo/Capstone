import { useState } from "react";
import ZipcodeForm from "./ZipcodeForm";
import { saveFrostDates } from "./api";

function EnterFrostDates({
	frostDates,
	setFrostDates,
	setZipCode,
	handleSaveFrostDates, // This is the prop from App
	userEmail,
}) {
	const [zipInput, setZipInput] = useState("");
	const [firstFrost, setFirstFrost] = useState(frostDates.firstFrost || "");
	const [lastFrost, setLastFrost] = useState(frostDates.lastFrost || "");

	const handleZipcodeSubmit = (inputZipCode) => {
		setZipCode(inputZipCode);
		setZipInput(inputZipCode);
	};

	const handleSave = async () => {
		try {
			await saveFrostDates(firstFrost, lastFrost, userEmail);
			setFrostDates({ firstFrost, lastFrost });
			// This should set it to true after the save, if you need this state
		} catch (error) {
			console.error("Error saving frost dates:", error);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent the default form submission
		handleSave(); // Call the renamed function instead
	};

	return (
		<div className="frostdates-section">
			<h3>
				Enter the first and last frost average dates for your region.
			</h3>
			<p>
				You can find these dates by zipcode at{" "}
				<a
					href="https://www.almanac.com/gardening/frostdates/zipcode"
					target="_blank"
					rel="noopener noreferrer"
				>
					Old Farmer's Almanac
				</a>
			</p>
			<div className="zipcode-search">
				<ZipcodeForm setZipCode={handleZipcodeSubmit} />

				{zipInput && (
					<a
						href={`https://www.almanac.com/gardening/frostdates/zipcode/${zipInput}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						See Frost Dates for {zipInput}
					</a>
				)}
			</div>
			<form onSubmit={handleSubmit} className="frostdate-input">
				<div>
					<label htmlFor="firstFrost">
						First Frost Date of Fall:
					</label>
					<input
						type="date"
						id="firstFrost"
						value={firstFrost}
						onChange={(e) => setFirstFrost(e.target.value)}
						required
					/>
					🍂
				</div>
				<div>
					<label htmlFor="lastFrost">
						Last Frost Date of Spring:
					</label>
					<input
						type="date"
						id="lastFrost"
						value={lastFrost}
						onChange={(e) => setLastFrost(e.target.value)}
						required
					/>
					🌱
				</div>

				<br />
				<button type="submit">Save Frost Dates</button>
			</form>
		</div>
	);
}

export default EnterFrostDates;
