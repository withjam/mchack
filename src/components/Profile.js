import { getAuth, updateProfile } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'state';
import ReactLoading from 'react-loading';

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
        <form onSubmit={doSubmit} data-component="profile">
            {profile.photoURL && 
                <img src={profile.photoURL} alt="{profile.displayName}" className="bgphoto" />
            }               

            <div className="photo">
                <button type="button" disabled={!isEditMode} onClick={() => uploadWidget.current.open()} className="ghost profile">
                    <picture>
                        {profile.photoURL ? (
                            <img src={profile.photoURL} alt="{profile.displayName}" />
                        ) : (
                            <svg height="240" viewBox="0 0 32 32" width="240" xmlns="http://www.w3.org/2000/svg"><g id="user_account_people_man" data-name="user, account, people, man"><path fill="var(--color-font)" d="m23.7373 16.1812a1 1 0 1 0 -1.4062 1.4218 8.9378 8.9378 0 0 1 2.6689 6.397c0 1.2231-3.5059 3-9 3s-9-1.7778-9-3.002a8.9385 8.9385 0 0 1 2.6348-6.3627 1 1 0 1 0 -1.4141-1.4141 10.9267 10.9267 0 0 0 -3.2207 7.7788c0 3.2476 5.667 5 11 5s11-1.7524 11-5a10.92 10.92 0 0 0 -3.2627-7.8188z"/><path fill="var(--color-font)" d="m16 17a7 7 0 1 0 -7-7 7.0081 7.0081 0 0 0 7 7zm0-12a5 5 0 1 1 -5 5 5.0059 5.0059 0 0 1 5-5z"/></g></svg>
                        )}
                    </picture>
                </button>
            </div>

            <header>
                {isEditMode ? (
                    <div class="formfield">
                        <input value={profile.displayName ?? ''} onChange={editProfile('displayName')} />
                        <label>Display Name</label>
                    </div>
                ) : (
                    <h1>{profile.displayName}</h1>
                )}
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
                            <button type="reset" onClick={doCancel} className="ghost">
                                Cancel
                            </button>
                            <button type="submit">Save</button>
                        </>
                    ))}
            </section>
        </form>
	);
};

export default Profile;
