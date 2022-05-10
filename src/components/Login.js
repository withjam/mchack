import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';
import { Helmet } from 'react-helmet';

const SIMPLE_EMAIL_CHECK = /^(.+)@(.+)$/;

export const Login = props => {
	const auth = getAuth();
	const isAnonymous = useSelector(isAnonymousSelector);
	const { isNew } = props;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [validPass, setValidPass] = useState(false);
	const [validEmail, setValidEmail] = useState(false);
	const isValid = validEmail && validPass;
	const title = isNew ? 'Create a new account' : 'Log In';

	// if already logged in, redirect to home
	if (isAnonymous === false) {
		return <Navigate to="/" />;
	}

	function doSubmit(ev) {
		ev.preventDefault();
		if (isValid) {
			if (isNew) {
				createUserWithEmailAndPassword(auth, email, password)
					.then(creds => {
						console.log('sign up ', creds);
					})
					.catch(err => {
						console.error(err);
					});
			} else {
				signInWithEmailAndPassword(auth, email, password)
					.then(creds => {
						console.log('sign in ', creds);
					})
					.catch(err => {
						console.error(err);
					});
			}
		}
		return false;
	}

	// basic email value validation
	function changeEmail(value) {
		setEmail(value);
		if (value && SIMPLE_EMAIL_CHECK.test(value)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
		}
	}

	// password validation (not empty and at least 6 characters)
	function changePassword(value) {
		setPassword(value);
		if (value && value.length >= 6) {
			setValidPass(true);
		} else {
			setValidPass(false);
		}
	}

	return (
		<>
			<Helmet>
				<title>{title} - Be a Canadian!</title>
			</Helmet>
			<section aria-labelledby={title} className="content">
				<div className="col" data-size="4">
					<div class="login-container">
						<form onSubmit={doSubmit} className="login">
							<fieldset>
								<legend id={title}>{title}</legend>
								<div className="form-section">
									<label htmlFor="login-email">Email</label>
									<input
										className={`${validEmail ? 'valid' : 'invalid'}`}
										id="login-email"
										type="email"
										value={email}
										onChange={e => changeEmail(e.target.value)}
									/>
								</div>
								<div className="form-section">
									<label htmlFor="login-password">Password</label>
									<input
										className={`${validPass ? 'valid' : 'invalid'}`}
										id="login-password"
										type="password"
										value={password}
										onChange={e => changePassword(e.target.value)}
									/>
								</div>
							</fieldset>
							<button className="primary" type="submit" disabled={!validPass || !validEmail}>
								{title}
							</button>
						</form>
						<div className="user-type">
							{isNew ? (
								<span>
									<Link to="/sign/in">Log-in</Link>
								</span>
							) : (
								<span>
									<Link to="/sign/up">Create a new account</Link>
								</span>
							)}
						</div>
					</div>
				</div>
				<div className="col" data-size="12">
					<h1>Welcome - Learn how to be a Canadian</h1>
					<p>
						Neve Campbell was Canada's first scarf. And Leslie Nielsen, you've been reading a copy of Chatelaine, from 1983. We're here
						today to talk about snow shoe and Canada, and Terry Fox is the expert in our family. It's in the Canadian Criminal Code, eh.
						Like there's legal goose set in cases in law, eh?
					</p>
					<p>
						Geez, there's a lot of chinook, eh? Ottawa castle, Nunavut brewery, Royal Canadian Institute for the Mentally Insane… hey,
						that's the loony bin, eh? Like I'm smart playing elk and doing things like curling rock, and Jim Carrey's smarter when it
						comes to clear thinking and explaining things to people. I've met Montreal Expos and snowmobiles smarter than Celine Dion and
						Matthew Perry. Sir John A. Macdonald wants revenge! I know it!
					</p>
					<p>
						Geez, a tunnel to Bacon Cove! Take off, how convenient! We put on our two-four and bought a timbit to get plastered in
						Labrador. Nelly Furtado had a nervous breakdown, huh? Me too, when Michael Buble was born. I'm Constable William Shatner.
						Peter Jennings wants revenge! I know it! But Don Cherry, you know how much that poutine means to me. No, the thing is Seth
						Rogen, is that when I had the jean jacket runnin' in Sober Island there was all these things going on, you were fixin' your
						hair and If I'd known it was going to take so long I wouldn't have left it runnin'. Born and raised in Toronto, where they
						grew up to be somebody who gives themself a nickname. Watch your step and remember, Will Arnett is watching you. Sign it to
						Howie Mandel, my good pal. Maybe we ought to call Bryan Adams, eh? Get all of Prince Rupert here, eh? Well, we found this rink
						in a bottle of your beer. Oscar Peterson had some and they puked. Not so long ago when Lorne Michaels was on the bottling
						lines, this sort of thing didn’t happen. Michael J. Fox put some totem pole in the beer, and they make us drink it every day!
						It's in the Canadian Criminal Code, eh. Like there's legal loonie set in cases in law, eh? I've got a plan, alright? Go get
						Sidney Crosby, Bobby Orr and Rachel McAdams. Justin Bieber was Canada's first maple syrup. Denied, Ouch, Morley Safer got
						their ribs rattled. It's time Quebec joined the 20th century.
					</p>
				</div>
			</section>
		</>
	);
};

export default Login;
