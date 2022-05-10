import logo from 'assets/logo.svg';
import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';

export const Header = () => {
	const isAnonymous = useSelector(isAnonymousSelector);
	function logout() {
		getAuth().signOut();
	}
	function toggleMenu() {
		let menuTrigger = document.querySelector('.menu-trigger');
		menuTrigger.getAttribute('aria-expanded') === 'true' ? menuTrigger.setAttribute('aria-expanded', 'false') : menuTrigger.setAttribute('aria-expanded', 'true');
	}
	return (
		<header className="App-header">
			<img src={logo} className="App-logo" alt="logo" />
			<span className="h2">Voila</span>
			<button className="menu-trigger" aria-expanded="false" aria-controls="menu" onClick={toggleMenu}>...</button>
			<ul id="menu">
				<li><a href="/">Home</a></li>
				<li><a href="/notes">Notes</a></li>
				<li><a href="/profile">Profile</a></li>
				<li>{isAnonymous === false && <button onClick={logout}>Logout</button>}</li>
			</ul>
		</header>
	);
};

export default Header;
