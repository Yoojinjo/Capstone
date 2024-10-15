import { useState } from "react";
import Calendar from "./Calendar";
import ZipcodeForm from "./ZipcodeForm";
import "./App.css";

function App() {
	const [zipCode, setZipCode] = useState("");

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
						Open Frost Dates for {zipCode}
					</a>
				</div>
			)}
			<Calendar />
		</>
	);
}

export default App;
