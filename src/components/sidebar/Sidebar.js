import cssman from 'assets/cssman.svg';
import logo from 'assets/logo.svg';
import './Sidebar.scss';

export const Sidebar = () => {
	return (
		<aside className="sidebar">
			<div className="sidebar-logo">
				<img src={cssman} className="img-cssman" alt="" />
				<img src={logo} className="img-csshack" alt="CSS Hack" />
			</div>
		</aside>
	);
};

export default Sidebar;
