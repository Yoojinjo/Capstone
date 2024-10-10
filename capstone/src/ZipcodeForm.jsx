import { useState } from "react";

function ZipcodeForm() {
	const [zipcode, setZipcode] = useState("");

	const handleZipcodeSubmit = (e) => {
		e.preventDefault();
		// Handle the submitted zipcode (e.g., validation or API call)
		console.log("Submitted zipcode:", zipcode);
	};

	return (
		<div className="zipcode-form">
			<form onSubmit={handleZipcodeSubmit}>
				<label>
					Enter Zipcode:
					<input
						type="text"
						value={zipcode}
						onChange={(e) => setZipcode(e.target.value)}
						placeholder="Enter Zipcode"
					/>
				</label>
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
export default ZipcodeForm;
