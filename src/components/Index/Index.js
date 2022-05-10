import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'state';
import Header from '../Header/Header';

export const Index = () => {
	const user = useSelector(userProfileSelector);
	const [isEditMode, setEditMode] = useState(false);
	// manage an editable copy of the user data
	const [profile, setProfile] = useState({ ...user });
	const [isSaving, setSaving] = useState(false);

	return (
		<section className="card index">
			<Header/>
			<h1>Home</h1>
			<section id="controls">
				<a className="button" href="/notes">Notes</a>
				<a className="button" href="/profile">Profile</a>
			</section>
		</section>
	);
};

export default Index;
