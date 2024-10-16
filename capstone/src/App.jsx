import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import ZipcodeForm from "./ZipcodeForm";
import "./App.css";
import { saveFrostDates, getFrostDates } from "./api";

function App() {
	const [zipCode, setZipCode] = useState("");
	const [frostDates, setFrostDates] = useState({
		firstFrost: "",
		lastFrost: "",
	});

	useEffect(() => {
		const fetchFrostDates = async () => {
			try {
				const data = await getFrostDates();
				setFrostDates(data);
			} catch (error) {
				console.error("Error fetching frost dates", error);
			}
		};

		fetchFrostDates();
	}, []); // empty array runs once on mount

	// Handle the change of date inputs
	const handleFrostDateChange = (e) => {
		const { name, value } = e.target;
		setFrostDates((prevDates) => ({
			...prevDates,
			[name]: value, // Update the specific date (first or last)
		}));
	};
	// save frost dates
	const handleSaveFrostDates = async (e) => {
		e.preventDefault();

		try {
			const response = await saveFrostDates(
				frostDates.firstFrost,
				frostDates.lastFrost
			);
			console.log(response); // Handle the response as needed
			alert("Frost dates saved successfully!");
		} catch (error) {
			console.error("Error saving frost dates", error);
			alert("There was an error saving the frost dates.");
		}
	};
	return (
		<>
			<h1>Garden Calendar v.0</h1>
			<h5>Enter your zipcode</h5>
			<ZipcodeForm setZipCode={setZipCode} />
			{zipCode && (
				<div>
					<h5>Frost Dates for Zipcode: {zipCode}</h5>
					<a
						href={`https://www.almanac.com/gardening/frostdates/zipcode/${zipCode}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						See Frost Dates for {zipCode}
					</a>

					{/* Date Inputs for First and Last Frost */}
					<div>
						<label>
							First Fall Frost:
							<input
								type="date"
								name="firstFrost"
								value={frostDates.firstFrost}
								onChange={handleFrostDateChange}
							/>
						</label>
					</div>

					<div>
						<label>
							Last Spring Frost:
							<input
								type="date"
								name="lastFrost"
								value={frostDates.lastFrost}
								onChange={handleFrostDateChange}
							/>
						</label>
					</div>
					<button
						onClick={handleSaveFrostDates}
						disabled={
							!frostDates.firstFrost || !frostDates.lastFrost
						}
					>
						Save Frost Dates
					</button>
				</div>
			)}
			<Calendar frostDates={frostDates} />
		</>
	);
}

export default App;
