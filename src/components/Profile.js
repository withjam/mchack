import { getAuth, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'state';
import ReactLoading from 'react-loading';

import noPhoto from '../assets/nophoto.png';

export const Profile = () => {
	const user = useSelector(userProfileSelector);
	const [isEditMode, setEditMode] = useState(false);
	// manage an editable copy of the user data
	const [profile, setProfile] = useState({ ...user });
	const [isSaving, setSaving] = useState(false);

	function doSubmit(ev) {
		ev.preventDefault();
		if (isEditMode) {
			console.log('save ', profile);
			(async function () {
				try {
					setSaving(true);
					const fbUser = getAuth().currentUser;
					const { displayName, photoURL } = profile;
					await updateProfile(fbUser, { displayName, photoURL });
					setEditMode(false);
				} catch (ex) {
					console.error(ex);
				} finally {
					setSaving(false);
				}
			})();
			setEditMode(false);
		}
		return false;
	}

	function doCancel() {
		setEditMode(false);
		setProfile({ ...user });
	}

	function editProfile(propName) {
		return ev => {
			setProfile({ ...profile, [propName]: ev.target.value });
		};
	}

	return (
		<form onSubmit={doSubmit}>
			<picture>{profile.photoURL ? <img src={profile.photoURL} alt="" /> : <img src={noPhoto} alt="" width="220" height="220" />}</picture>
			<header>
				<h1>
					{isEditMode ? (
						<input value={profile.displayName ?? ''} placeholder="Display name" onChange={editProfile('displayName')} />
					) : (
						profile.displayName
					)}
				</h1>
				<h2>{profile.email}</h2>
			</header>
			<section>
				{!isEditMode && (
					<button type="button" onClick={() => setEditMode(true)}>
						Edit
					</button>
				)}
				{isEditMode &&
					(isSaving ? (
						<ReactLoading color="lightgray" type="spinningBubbles" />
					) : (
						<>
							<button type="reset" onClick={doCancel}>
								cancel
							</button>
							<button type="submit">Save</button>
						</>
					))}
			</section>
		</form>
	);
};

export default Profile;
