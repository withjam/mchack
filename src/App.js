import './App.css';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Header from 'components/Header';

function App() {
	const location = useLocation();
	// quick + dirty way to enforce authentication before viewing anything but the login/signup form
	if (!location.pathname.includes('/sign/')) {
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
