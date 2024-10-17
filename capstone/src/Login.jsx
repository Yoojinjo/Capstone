import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Make sure this is the correct path to your firebase.js file

function Login({ onLogin }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Sign in the user using Firebase authentication
			await signInWithEmailAndPassword(auth, email, password);

			// Once signed in, get the user's email from the auth object
			const userEmail = auth.currentUser.email;

			// Trigger onLogin with the user's email
			onLogin(userEmail);
		} catch (error) {
			console.error("Error logging in:", error);
			alert("Failed to log in. Please check your credentials.");
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
			<fieldset>
				<legend>Login</legend>
				<div>
					<label htmlFor="email">Email:</label>
					<input
						type="email"
						id="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your password"
						required
					/>
				</div>
				<button type="submit">Login</button>
			</fieldset>
		</form>
	);
}

export default Login;
