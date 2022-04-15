import { Route, Routes } from 'react-router-dom';

import App from 'App';
import Login from 'components/Login';
import Profile from 'components/Profile';

export default function Routing() {
	return (
		<Routes>
			<Route path="/" element={<App />}>
				<Route index element={<Profile />} />
				<Route path="/sign/up" element={<Login isNew />} />
				<Route path="/sign/in" element={<Login />} />
			</Route>
		</Routes>
	);
}
