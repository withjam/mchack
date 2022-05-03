import { getAuth } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';
import './Subnav.scss';

export const Subnav = () => {
	const isAnonymous = useSelector(isAnonymousSelector);
	function logout() {
		getAuth().signOut();
	}
	return (
		<div className="subnav">
			{isAnonymous === false && (
				<mc-button class="plain" onClick={logout}>
					Logout
				</mc-button>
			)}
		</div>
	);
};

export default Subnav;
