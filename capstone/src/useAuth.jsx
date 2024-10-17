import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
	const [loggedIn, setLoggedIn] = useState(false);
	const [userEmail, setUserEmail] = useState("");

	useEffect(() => {
		const auth = getAuth();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setLoggedIn(true);
				setUserEmail(user.email);
			} else {
				setLoggedIn(false);
				setUserEmail("");
			}
		});

		return () => unsubscribe();
	}, []);

	const handleLogout = () => {
		const auth = getAuth();
		auth.signOut();
		setLoggedIn(false);
		setUserEmail("");
	};

	return { loggedIn, userEmail, handleLogout };
};
export default useAuth;
