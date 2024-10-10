import { useState } from "react";
import Calendar from "./Calendar";
import ZipcodeForm from "./ZipcodeForm";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1>Garden Calendar v.0</h1>
			<h5>enter your zipcode</h5>
			<ZipcodeForm />
			<Calendar />
		</>
	);
}

export default App;
