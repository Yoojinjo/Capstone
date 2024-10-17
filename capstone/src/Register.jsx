import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Register({ onRegister }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const auth = getAuth(); // Initialize the auth instance

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Use the new createUserWithEmailAndPassword method
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			console.log("User registered:", user);

			// Optionally trigger onRegister with the user's email
			onRegister(user.email);
		} catch (error) {
			console.error("Error registering user:", error);
			alert("Failed to register. Please check your credentials.");
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
			<fieldset>
				<legend>Register</legend>
				<div>
					<label htmlFor="register-email">Email:</label>
					<input
						type="email"
						id="register-email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Enter your email"
						required
					/>
				</div>
				<div>
					<label htmlFor="register-password">Password:</label>
					<input
						type="password"
						id="register-password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your password"
						required
					/>
				</div>
				<button type="submit">Register</button>
			</fieldset>
		</form>
	);
}

export default Register;
