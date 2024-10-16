import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
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
			// Do something with the registered user
		} catch (error) {
			console.error("Error registering user:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				placeholder="Email"
			/>
			<input
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Password"
			/>
			<button type="submit">Register</button>
		</form>
	);
}

export default Register;
