//import logo from 'assets/logo.svg';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';
import ThemeToggle from './ThemeToggle';

export const Header = () => {
	const isAnonymous = useSelector(isAnonymousSelector);
	function logout() {
		getAuth().signOut();
	}
	return (
		<header data-component="header">
            <ThemeToggle></ThemeToggle>
			{isAnonymous === false && <button onClick={logout} className="ghost sm">Logout</button>}
		</header>
	);
};

export default Header;
