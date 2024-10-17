import React from "react";

function LogoutButton({ onLogout }) {
	return (
		<button onClick={onLogout} className="logout-button">
			Logout
		</button>
	);
}

export default LogoutButton;
