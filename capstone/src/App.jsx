// App.jsx
import { useState, useEffect } from "react";
import Register from "./Register";
import Login from "./Login";
import Calendar from "./Calendar";
import EnterFrostDates from "./EnterFrostDates";
import "./App.css";
import { saveFrostDates, getFrostDates } from "./api";

function App() {
	const [frostDates, setFrostDates] = useState({
		firstFrost: "",
		lastFrost: "",
	});
	const [zipCode, setZipCode] = useState("");
	const [loggedIn, setLoggedIn] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [frostDatesSaved, setFrostDatesSaved] = useState(false);

	const handleLogin = (email) => {
		setLoggedIn(true);
		setUserEmail(email); // Save user email on login
	};

	const handleLogout = () => {
		setLoggedIn(false);
		setUserEmail(""); // Clear email on logout
		setFrostDatesSaved(false); // Reset frost dates saved status on logout
	};

	// Save frost dates handler
	const handleSaveFrostDates = async (firstFrost, lastFrost) => {
		setFrostDates({ firstFrost, lastFrost });
		await saveFrostDates(firstFrost, lastFrost); // Save frost dates with email
		setFrostDatesSaved(true);
	};

	// Check if frost dates are already saved for the user when logged in
	useEffect(() => {
		if (loggedIn && userEmail) {
			const fetchFrostDates = async () => {
				try {
					const frostData = await getFrostDates(userEmail);
					if (
						frostData &&
						frostData.firstFrost &&
						frostData.lastFrost
					) {
						setFrostDates({
							firstFrost: frostData.firstFrost,
							lastFrost: frostData.lastFrost,
						});
						setFrostDatesSaved(true); // Frost dates found and saved
					} else {
						setFrostDatesSaved(false); // No frost dates found
					}
				} catch (error) {
					console.error("Error fetching frost dates:", error);
				}
			};
			fetchFrostDates();
		}
	}, [loggedIn, userEmail]);

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

			{loggedIn && !frostDatesSaved ? ( // Conditionally render based on login status and frostdates entered
				<EnterFrostDates
					frostDates={frostDates}
					setZipCode={setZipCode} // Pass the setter to manage the zip code
					handleSaveFrostDates={handleSaveFrostDates}
					userEmail={userEmail}
				/>
			) : loggedIn && frostDatesSaved ? (
				<Calendar frostDates={frostDates} userEmail={userEmail} />
			) : (
				<p>Please log in</p>
			)}
		</div>
	);
}

export default App;
