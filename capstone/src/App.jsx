import { useState, useEffect } from "react";
import Register from "./Register";
import Login from "./Login";
import Calendar from "./Calendar";
import EnterFrostDates from "./EnterFrostDates";
import LogoutButton from "./LogOutButton";
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
		setFrostDates({
			firstFrost: "",
			lastFrost: "",
		});
	};

	// Save frost dates handler
	const handleSaveFrostDates = async (firstFrost, lastFrost) => {
		console.log("Saving Frost Dates:", { firstFrost, lastFrost });
		setFrostDates({ firstFrost, lastFrost });
		try {
			const response = await saveFrostDates(
				firstFrost,
				lastFrost,
				userEmail
			);
			console.log("Save response:", response); // Check the response
			setFrostDatesSaved(true);
			console.log("Frost dates saved successfully!");
		} catch (error) {
			console.error("Error saving frost dates:", error);
		}
	};

	// Check if frost dates are already saved for the user when logged in
	useEffect(() => {
		if (loggedIn && userEmail) {
			const fetchFrostDates = async () => {
				try {
					const frostData = await getFrostDates(userEmail);
					console.log(frostData);
					if (
						frostData &&
						frostData[0].firstFrost &&
						frostData[0].lastFrost
					) {
						setFrostDates({
							firstFrost: frostData[0].firstFrost,
							lastFrost: frostData[0].lastFrost,
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

	console.log("Logged In:", loggedIn);
	console.log("Frost Dates Saved:", frostDatesSaved);

	return (
		<div className="app-container">
			<h1>Fresh Tomatoes: Garden Planner (beta)</h1>
			{/* If not logged in, show Register and Login */}
			{!loggedIn && (
				<>
					<Register />
					<Login onLogin={handleLogin} />{" "}
					{/* Pass handleLogin to Login */}
				</>
			)}
			{/* If logged in, show EnterFrostDates */}
			{loggedIn && (
				<EnterFrostDates
					frostDates={frostDates}
					setFrostDates={setFrostDates}
					setZipCode={setZipCode} // Pass the setter to manage the zip code
					userEmail={userEmail}
					handleSaveFrostDates={handleSaveFrostDates}
				/>
			)}
			{loggedIn && frostDatesSaved && (
				<Calendar frostDates={frostDates} userEmail={userEmail} />
			)}

			{loggedIn && <LogoutButton onLogout={handleLogout} />}
		</div>
	);
}

export default App;
