import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from 'components/Header';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { isAnonymousSelector } from 'state';
import { login, logout } from 'state/user';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect } from 'react';

import ReactLoading from 'react-loading';

export const firebaseConfig = {
	apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
	authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
	storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE_SENDER_ID,
	appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function App() {
	const dispatch = useDispatch();
	useEffect(() => {
		// monitor changes to firebase auth when the app initializes
		if (dispatch) {
			return auth.onAuthStateChanged(user => {
				if (user) {
					dispatch(login(user.toJSON()));
				} else {
					dispatch(logout());
				}
			});
		}
	}, [dispatch]);

	const location = useLocation();
	const isAnonymous = useSelector(isAnonymousSelector);

	// simple way to detect if auth has loaded yet (typescript wouldn't like it)
	if (isAnonymous === undefined) {
		return <ReactLoading color="lightgray" type="spinningBubbles" />;
	}

	// quick + dirty way to enforce authentication before viewing anything but the login/signup form
	if (isAnonymous === true && !location.pathname.includes('/sign/')) {
		return <Navigate to="/sign/in" />;
	}

	return (
		<div className="App">
			<Header />
			<main>
				<Outlet />
			</main>
		</div>
	);
}

export default App;
