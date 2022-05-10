import { getAuth, updateProfile } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'state';
import ReactLoading from 'react-loading';

import noPhoto from '../assets/nophoto.png';

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

	function editProfile(propName) {
		return ev => {
			setProfile({ ...profile, [propName]: ev.target.value });
		};
	}

	return (
		<form onSubmit={doSubmit}>
			<div className="p-3 px-6 min-h-48 flex justify-center items-center">
				<div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-zinc-100 text-zinc-900 dark:bg-coolGray-900 dark:text-coolGray-100">
					<button type="button" disabled={!isEditMode} onClick={() => uploadWidget.current.open()}>
						<picture>
							{profile.photoURL ? (
								<img
									src={profile.photoURL}
									alt=""
									width="220"
									height="220"
									className="w-32 h-32 mx-auto rounded-full dark:bg-coolGray-500 aspect-square"
								/>
							) : (
								<img
									src={noPhoto}
									alt=""
									width="220"
									height="220"
									className="w-32 h-32 mx-auto rounded-full dark:bg-coolGray-500 aspect-square"
								/>
							)}
						</picture>
					</button>
					<div className="space-y-4 text-center divide-y divide-coolGray-700">
						<div className="my-2 space-y-1">
							<h2 className="text-zinc-900 text-xl font-semibold sm:text-2xl">
								{isEditMode ? (
									<input
										value={profile.displayName ?? ''}
										placeholder="Display name"
										onChange={editProfile('displayName')}
										className="w-full px-3 py-2 border rounded-md border-zinc-200 bg-zinc-200 text-center text-zinc-900 dark:border-coolGray-700 dark:bg-coolGray-900 dark:text-coolGray-100 outline-2 outline-violet-500/50"
									/>
								) : (
									profile.displayName
								)}
							</h2>
							<p className="px-5 text-xs sm:text-base text-zinc-900 dark:text-coolGray-400">{profile.email}</p>
						</div>
						<div className="flex justify-center pt-2 space-x-4 align-center">
							{!isEditMode && (
								<button
									type="button"
									onClick={() => setEditMode(true)}
									className="w-full px-8 py-3 rounded-md bg-violet-700 text-zinc-100"
								>
									Edit
								</button>
							)}
							{isEditMode &&
								(isSaving ? (
									<ReactLoading color="lightgray" type="spinningBubbles" />
								) : (
									<>
										<button
											type="reset"
											onClick={doCancel}
											className="w-full px-8 py-3 rounded-md font-semibold border text-zinc-900 border-violet-700"
										>
											cancel
										</button>
										<button type="submit" className="w-full px-8 py-3 rounded-md bg-violet-700 text-zinc-100">
											Save
										</button>
									</>
								))}
						</div>
					</div>
				</div>
			</div>
		</form>
	);
};

export default Profile;
