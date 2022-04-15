import logo from 'assets/logo.svg';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';

export const Header = () => {
	const isAnonymous = useSelector(isAnonymousSelector);
	function logout() {
		getAuth().signOut();
	}
	return (
		<header className="App-header">
			<div></div>
			<img src={logo} className="App-logo" alt="logo" />
			<div>{isAnonymous === false && <button onClick={logout}>Logout</button>}</div>
		</header>
	);
};

export default Header;
