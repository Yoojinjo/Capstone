// App.jsx
import { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import Calendar from "./Calendar";
import EnterFrostDates from "./EnterFrostDates";
import "./App.css";
import { saveFrostDates } from "./api";

function App() {
	const [frostDates, setFrostDates] = useState({
		firstFrost: "",
		lastFrost: "",
	});
	const [zipCode, setZipCode] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);

	// update login status
	const handleLogin = () => {
		setLoggedIn(true);
	};
	// Save frost dates handler
	const handleSaveFrostDates = (firstFrost, lastFrost) => {
		setFrostDates({ firstFrost, lastFrost });
		saveFrostDates(firstFrost, lastFrost); // Call your API to save frost dates
	};

	return (
		<div className="app-container">
			<h1>Fresh Tomatoes: Garden Planner (beta)</h1>
			<Register />
			<Login onLogin={handleLogin} /> {/* Pass handleLogin  to Login */}
			{loggedIn && (
				<EnterFrostDates
					frostDates={frostDates}
					setZipCode={setZipCode} // Pass the setter to manage the zip code
					handleSaveFrostDates={handleSaveFrostDates}
				/>
			)}
			{/* Pass frostDates to Calendar */}
			{/* <Calendar frostDates={frostDates} /> */}
		</div>
	);
}

export default App;
