import logo from 'assets/canada.png';
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
			<div className="header-container">
				<img src={logo} className="App-logo" alt="logo" />
				<div>
					{isAnonymous === false && (
						<button className="invert" onClick={logout}>
							Logout
						</button>
					)}
				</div>
			</div>
		</header>
	);
};

export default Header;
