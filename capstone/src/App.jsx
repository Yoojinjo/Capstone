import { useState } from "react";
import Calendar from "./Calendar";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<h1>Garden Calendar v.0</h1>
			<Calendar />
		</>
	);
}

export default App;
