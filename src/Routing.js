import { Route, Routes } from 'react-router-dom';

import App from 'App';
import Login from 'components/Login';
import { useEffect } from 'react';
import Home from 'components/Home';

console.log('Routing module loaded');

export default function Routing() {
	useEffect(() => {
		console.log('Routing mounted');
		return () => console.log('Routing dismounted');
	}, []);
	console.log('Routing rendered');
	return (
		<Routes>
			<Route path="/" element={<App />}>
				<Route index element={<Home />} />
				<Route path="/sign/up" element={<Login isNew />} />
				<Route path="/sign/in" element={<Login />} />
			</Route>
		</Routes>
	);
}
