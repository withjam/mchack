import { Route, Routes } from 'react-router-dom';

import App from 'App';
import Login from 'components/Login/Login';
import Index from 'components/Index/Index';
import Profile from 'components/Profile/Profile';
import Notes from 'components/Notes/Notes';

export default function Routing() {
	return (
		<Routes>
			<Route path="/" element={<App />}>
				<Route index element={<Index />} />
				<Route path="/notes" element={<Notes />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/sign/up" element={<Login isNew />} />
				<Route path="/sign/in" element={<Login />} />
			</Route>
		</Routes>
	);
}
