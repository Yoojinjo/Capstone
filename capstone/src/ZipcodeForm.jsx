import { useState } from "react";

function ZipcodeForm({ setZipCode }) {
	const [inputZipCode, setInputZipCode] = useState("");

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		setZipCode(inputZipCode); // Pass the zip code back to App
	};

	return (
		<form onSubmit={handleSubmit} className="zipcode-form">
			{/* Zip Code Input */}
			<div>
				<label htmlFor="zipcode">Zip Code:</label>
				<input
					type="text"
					id="zipcode"
					value={inputZipCode}
					onChange={(e) => setInputZipCode(e.target.value)}
					required
				/>
			</div>

			<button type="submit">Submit</button>
		</form>
	);
}

export default ZipcodeForm;
