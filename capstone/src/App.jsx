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
	const [userEmail, setUserEmail] = useState("");

	const handleLogin = (email) => {
		setLoggedIn(true);
		setUserEmail(email); // Save user email on login
	};

	const handleLogout = () => {
		setLoggedIn(false);
		setUserEmail(""); // Clear email on logout
	};

	// Save frost dates handler
	const handleSaveFrostDates = (firstFrost, lastFrost) => {
		setFrostDates({ firstFrost, lastFrost });
		saveFrostDates(firstFrost, lastFrost); // Call your API to save frost dates
	};

	return (
		<div className="app-container">
			<h1>Fresh Tomatoes: Garden Planner (beta)</h1>
			{/* Only show Register and Login if not logged in */}
			{!loggedIn && (
				<>
					<Register />
					<Login onLogin={handleLogin} />{" "}
					{/* Pass handleLogin to Login */}
				</>
			)}

			{loggedIn ? ( // Conditionally render based on login status
				<EnterFrostDates
					frostDates={frostDates}
					setZipCode={setZipCode} // Pass the setter to manage the zip code
					handleSaveFrostDates={handleSaveFrostDates}
					userEmail={userEmail}
				/>
			) : (
				<p>Please log in</p> // Message for non-logged-in users
			)}
			{/* Pass frostDates to Calendar */}
			<Calendar frostDates={frostDates} userEmail={userEmail} />
		</div>
	);
}

export default App;
