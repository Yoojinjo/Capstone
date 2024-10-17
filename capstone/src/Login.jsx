import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Ensure this is correctly pointing to your Firebase config

function Login({ onLogin }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await signInWithEmailAndPassword(auth, email, password);
			const userEmail = auth.currentUser.email;
			onLogin(userEmail); // Pass user email to onLogin
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
