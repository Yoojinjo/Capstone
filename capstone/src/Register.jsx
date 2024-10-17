import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase"; // Assuming you have set up Firebase authentication

const Register = ({ onRegister }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(""); // Clear previous errors
		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			onRegister(userCredential.user.email); // Call the onRegister function with the user's email
		} catch (err) {
			if (err.code === "auth/email-already-in-use") {
				setError(
					"This email is already in use. Please log in or use a different email."
				);
			} else {
				setError(`Error registering user: ${err.message}`);
			}
			console.error("Error registering user:", err);
		}
	};

	return (
		<div>
			<h2>Register</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}
			<form onSubmit={handleSubmit}>
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="Email"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					required
				/>
				<button type="submit">Register</button>
			</form>
		</div>
	);
};

export default Register;
