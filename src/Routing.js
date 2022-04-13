import { Route, Routes } from 'react-router-dom';

import App from 'App';
import Login from 'components/Login';

export default function Routing() {
	return (
		<Routes>
			<Route path="/" element={<App />}>
				<Route path="/sign/up" element={<Login isNew />} />
				<Route path="/sign/in" element={<Login />} />
			</Route>
		</Routes>
	);
}
