import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';

export const Header = () => {
	const isAnonymous = useSelector(isAnonymousSelector);
	function logout() {
		getAuth().signOut();
	}
	return (
		<header className="p-2 px-6 min-h-48 flex justify-center items-right">
			{isAnonymous === false && <button onClick={logout}>Logout</button>}
		</header>
	);
};

export default Header;
