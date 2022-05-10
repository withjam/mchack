import { getAuth, updateProfile } from 'firebase/auth';
import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userProfileSelector } from 'state';
import ReactLoading from 'react-loading';
import { Helmet } from 'react-helmet';
import useSound from 'use-sound';

import noPhoto from '../assets/nophoto.png';
import boopSfx from '../assets/canada.mp3';

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
	const editFieldRef = useRef(null);
	const editButtonRef = useRef(null);
	const [play] = useSound(boopSfx);

	const people = [
		{
			name: 'Avril Lavigne, Singer',
			image: 'https://i.insider.com/577677c60aec95201b8b51b8?width=1300&format=jpeg&auto=webp',
		},
		{
			name: 'William Shatner, Actor',
			image: 'https://i.insider.com/577678006450a31c008b5551?width=1300&format=jpeg&auto=webp',
		},
		{
			name: 'Drake, Rapper',
			image: 'https://i.insider.com/57767c136450a31b008b5536?width=1300&format=jpeg&auto=webp',
		},
		{
			name: 'Terry Fox, Athlete/Humanitarian',
			image: 'https://i.insider.com/57767d196450a35c0d8b5385?width=1300&format=jpeg&auto=webp',
		},
		{
			name: 'Celine Dion, Singer',
			image: 'https://i.insider.com/57767c9e0aec957b448b4d5c?width=1300&format=jpeg&auto=webp',
		},
		{
			name: 'Wayne Gretzky, Athlete',
			image: 'https://i.insider.com/57767cb06450a31d008b5547?width=1300&format=jpeg&auto=webp',
		},
	];

	

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

	useEffect(() => {
		if (isEditMode) {
			editFieldRef.current.focus();
		} else {
			editButtonRef.current.focus();
		}
	}, [isEditMode]);

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
		<section className="content">
			<div class="col" data-size="5">
				<form onSubmit={doSubmit}>
					<div className="profile-manage">
						<div className="image">
							<picture>
								{profile.photoURL ? <img src={profile.photoURL} alt="" /> : <img src={noPhoto} alt="" />}

								{/* disabled={!isEditMode} */}
							</picture>
						</div>
						<div className="info">
							{!isEditMode && (
								<button className="primary" type="button" onClick={() => setEditMode(true)} ref={editButtonRef}>
									Edit your name
								</button>
							)}
							<p className="edit">
								{isEditMode && (
									<input
										aria-label="Edit Name"
										type="text"
										value={profile.displayName ?? ''}
										placeholder="Display name"
										ref={editFieldRef}
										onChange={editProfile('displayName')}
									/>
								)}
								{isEditMode &&
									(isSaving ? (
										<ReactLoading color="lightgray" type="spinningBubbles" />
									) : (
										<>
											<button className="secondary" type="reset" onClick={doCancel}>
												cancel
											</button>
											<button className="primary" type="submit" ref={editButtonRef}>
												Save
											</button>
										</>
									))}
							</p>
							<p>{profile.email}</p>
						</div>
						<div className="actions">
							<button className="secondary" type="button" onClick={() => uploadWidget.current.open()}>
								Edit your photo
							</button>
							<button onClick={play} className="secondary">
								Play O Canada
							</button>
						</div>
					</div>
				</form>
			</div>
			<div class="col" data-size="11">
				<Helmet>
					<title>Welcome {profile.displayName} - Steps to being a Canadian</title>
				</Helmet>
				<h1>
					Welcome {profile.displayName}
					<span>You are one step closer to becoming a true Canadian</span>
				</h1>

				<h2>Famous Canadians</h2>

				<div class="card-deck">
					{people.map((data, idx) => (
						<div class="card-item">
							<img src={data.image}></img>
							{data.name}
						</div>
					))}
				</div>
				<h2>History of Canada</h2>
				<p>
					We put on our chinook and bought a snow shoe to get plastered in Timmins. Take off, Samantha Bee likes me, eh? Yes. But they
					aren’t alone. They got two maple syrups with them. Well, we found this hockey stick in a bottle of your beer. Gordon Lightfoot had
					some and they puked. Not so long ago when Howie Mandel was on the bottling lines, this sort of thing didn’t happen. Shania Twain
					is renting this tuque for $12 a month. We're going to the Hudson’s Bay, Carly Rae Jepsen!
				</p>
				<p>
					Watch your step and remember, Oscar Peterson is watching you. Get me a toasted scarf and hold the toast. Leslie Nielsen is waiting
					for you. In the brewery room. I can show you the way. I know you like it when people call you Will Arnett. I'm leaving Pontypool
					with Sir John A. Macdonald. I need a little vacation.
				</p>
				<p>
					I don't know who's telling you that Neve Campbell is the brains of the operation, 'cause Justin Trudeau and Peter Puck are both
					the brains of the operation. Jim Carrey wants revenge! I know it! We are very happy to announce that today all the beer is free.
					It is courtesy of our good friend Norm MacDonald at Saskatoon Brewery. I've met cods and nanaimo bars smarter than Morley Safer
					and Anne Murray. I know you like it when people call you Ivan Reitman. I want you hosers to get me a mitten first thing in the
					morning. Well, we found this two-four in a bottle of your beer. Gordie Howe had some and they puked. Not so long ago when Sidney
					Crosby was on the bottling lines, this sort of thing didn’t happen.
				</p>
				<p>
					Kiefer Sutherland put some Toronto Blue Jay in the beer, and they make us drink it every day! In Canada, Winnipeg Jets only go up
					in price. Anyone knows that. Even k.d. Lang knows that. Maybe I ought to crank Trevor Linden's Labatt’s Blue bottle, eh, that
					should to start them up. Ok, start up, come on, eh! It's time Ottawa joined the 20th century. Canada has more igloos than any
					other country except one. Take off, Rachel McAdams likes me, eh? Yes. But they aren’t alone. They got two toonies with them.
				</p>
				<p>
					I've got a plan, alright? Go get Justin Bieber, Terry Fox and Keanu Reeves. Ah, tell it to your pumpkin, Ryan Reynolds. I'll never
					forget an exclusive interview in which Michael Cera revealed that he call his hockey stick the “Big Toronto Maple Leaf”, and they
					usually refer to the opposing players as “the little Stanley Cups”. Get me a toasted beer and hold the toast. I don't think I
					should be hanging around with you and Jason Priestly anymore. Born and raised in Dauphin, where they grew up to be somebody who
					gives themself a nickname. Maybe I ought to crank Ike Broflovski's beaver, eh, that should to start them up. Ok, start up, come
					on, eh! Hey, Wayne Gretzky, was there anything else in the box with this when you got it, like a lacrosse stick ?
				</p>
				<p>
					I've got a plan, alright? Go get Celine Dion, Paul Anka and Bachman-Turner Overdrive. I've talked to John Candy about it, they are
					probably gonna give me a hand because we both can’t have this moose floating around. It's a Niagara Falls canoe, and it's my
					jurisdiction. Were people in Labrador rude to you or something?
				</p>

				<h2>Learn how to speak like a Canadian</h2>
				<div className="video-container">
					<iframe
						src="https://www.youtube.com/embed/uXu2tVtaSWg"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowfullscreen
					></iframe>
				</div>
			</div>
		</section>
	);
};

export default Profile;
