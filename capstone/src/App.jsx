import { useState, useEffect } from "react";
import useAuth from "./useAuth";
import Register from "./Register";
import Login from "./Login";
import Calendar from "./Calendar";
import EnterFrostDates from "./EnterFrostDates";
import { saveFrostDates, getFrostDates } from "./api";

import "./App.css";

function App() {
	const { loggedIn, userEmail, handleLogout } = useAuth(); // Using custom hook
	const [frostDates, setFrostDates] = useState({
		firstFrost: "",
		lastFrost: "",
	});
	const [zipCode, setZipCode] = useState("");
	const [frostDatesSaved, setFrostDatesSaved] = useState(false);

	const handleLogin = (email) => {
		console.log("User logged in with email:", email);
		// Additional logic if needed for handling login, such as redirecting the user
	};

	// Save frost dates handler
	const handleSaveFrostDates = async (firstFrost, lastFrost) => {
		setFrostDates({ firstFrost, lastFrost });
		try {
			await saveFrostDates(firstFrost, lastFrost, userEmail);
			setFrostDatesSaved(true);
		} catch (error) {
			console.error("Error saving frost dates:", error);
			alert("An error occurred while saving the frost dates.");
		}
	};

	// Check if frost dates are already saved for the user when logged in
	useEffect(() => {
		if (loggedIn && userEmail) {
			const fetchFrostDates = async () => {
				try {
					const frostData = await getFrostDates(userEmail);
					if (frostData?.[0]?.firstFrost && frostData[0].lastFrost) {
						setFrostDates(frostData[0]);
						setFrostDatesSaved(true);
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
			{!loggedIn ? (
				<>
					<Register onRegister={handleLogin} />
					<br />
					<Login onLogin={handleLogin} />
				</>
			) : !frostDatesSaved ? (
				<EnterFrostDates
					frostDates={frostDates}
					setFrostDates={setFrostDates}
					setZipCode={setZipCode}
					userEmail={userEmail}
					handleSaveFrostDates={handleSaveFrostDates}
				/>
			) : (
				<Calendar
					frostDates={frostDates}
					userEmail={userEmail}
					onLogout={handleLogout}
				/>
			)}
		</div>
	);
}

export default App;
