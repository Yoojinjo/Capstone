import axios from "axios";

const API_KEY = "AHX6EBPVYW74YN4VLFV6E8WNQ"; // Replace with your actual API key
const LOCATION = "60025";
const START_DATE = "2023-01-01"; // Start date for the historical weather data
const END_DATE = "2023-12-31"; // End date for the entire year

export const getFrostData = async (date) => {
	try {
		const response = await axios.get(
			`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${LOCATION}/${START_DATE}/${END_DATE}?unitGroup=us&elements=temp&key=${API_KEY}`
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching frost data:", error);
		return null;
	}
};
