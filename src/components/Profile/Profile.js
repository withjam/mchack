import { getAuth, updateProfile } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'state';
import ReactLoading from 'react-loading';
import Header from '../Header/Header';
// import Uploady from "@rpldy/uploady";
// import UploadButton from "@rpldy/upload-button";

import noPhoto from '../../assets/nophoto.png';

function toCloudinaryTransform(arr) {
	// c_crop,h_150,w_150,x_80,y_30
	return `c_crop,h_${arr.height},w_${arr.width},x_${arr.x},y_${arr.y}`;
}

export const Profile = () => {
	const user = useSelector(userProfileSelector);
	const [isEditMode, setEditMode] = useState(false);
	// manage an editable copy of the user data
	const [profile, setProfile] = useState({ ...user });
	const [isSaving, setSaving] = useState(false);
	const cloudinary = window.cloudinary;
	const uploadWidget = useRef();

	// initialize the widget when component loads and cloudinary is ready
	useEffect(() => {
		if (cloudinary) {
			uploadWidget.current = cloudinary.createUploadWidget(
				{
					cloudName: process.env.REACT_APP_CLOUDINARY_NAME,
					uploadPreset: process.env.REACT_APP_CLOUDINARY_PRESET,
					cropping: true,
					maxFiles: 1,
					multiple: false,
					croppingAspectRatio: 1,
					croppingShowDimensions: true,
				},
				(error, result) => {
					if (error) {
						console.error(error);
					} else {
						const { event, info } = result;
						// console.log all cloudinary upload widget events
						// console.log('cloudinary widget event', event, info, result);
						if ('queues-end' === event && info.files.length && info.files[0].aborted === false) {
							// new upload, apply transformation if cropped - otherwise use intrinsic dimensions
							let photoURL = info.files[0].uploadInfo.secure_url;
							const dimensions = info.files[0].dimensions || [0, 0];
							const trans = toCloudinaryTransform(
								info.files[0].customCoordinates || { x: 0, y: 0, width: dimensions[0], height: dimensions[1] }
							);
							photoURL = photoURL.replace('/upload/', `/upload/${trans}/`);
							setProfile(oldProfile => ({ ...oldProfile, photoURL }));
						}
					}
				}
			);
			return () => uploadWidget.current.destroy();
		}
	}, [cloudinary]);

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

	function editProfile(propName, value) {
		setProfile({ ...profile, [propName]: value });
	}

	function growAllLabels() {
		[...document.querySelectorAll('input')].forEach(input => {
			growLabel(input);
		});
	}

	function onSetEditMode() {
		setTimeout(growAllLabels, 100);
	}

	function growLabel(input) {
		let label = document.querySelector(`label[for=${input.id}]`);
		if (!label.classList.contains('non-placeholder')) {
			label.classList.add('non-placeholder');
		}
	}

	function shrinkLabel(input) {
		if (!input.value) {
			let label = document.querySelector(`label[for=${input.id}]`);
			label.classList.remove('non-placeholder');
		}
	}

	return (
		<section className="card profile">
			<Header/>
			<form onSubmit={doSubmit}>
					<picture>
						{profile.photoURL ? (
							<img src={profile.photoURL} alt="" width="220" height="220" />
						) : (
							<img src={noPhoto} alt="" width="220" height="220" />
						)}
					<button type="button" disabled={!isEditMode} onClick={() => uploadWidget.current.open()}>Edit profile image</button>
					</picture>
				<section id="details">
					{isEditMode ? (
						<>
							<div className="input">
								<label htmlFor="username">Username</label>
								<input
									id="username"
									value={profile.displayName ?? ''}
									onChange={e => {editProfile('displayName', e.target.value); growLabel(e.target);}}
									onFocus={e => growLabel(e.target)}
									onBlur={e => shrinkLabel(e.target)}
								/>
							</div>
							<div className="input">
								<label htmlFor="email">Email address</label>
								<input
									id="email"
									value={profile.email ?? ''}
									onChange={e => {editProfile('email', e.target.value); growLabel(e.target);}}
									onFocus={e => growLabel(e.target)}
									onBlur={e => shrinkLabel(e.target)}
								/>
							</div>
						</>
					) : (
						<>
							<h1 id="username">@{profile.displayName}</h1>
							<h2 id="email">{profile.email}</h2>
						</>
					)}
				</section>
				<section id="controls">
					{!isEditMode && (
						<button type="button" onClick={() => {setEditMode(true); onSetEditMode();}}>
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
		</section>
	);
};

export default Profile;
