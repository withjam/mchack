import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useSelector } from 'react-redux';
import { isAnonymousSelector } from 'state';

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
	const title = isNew ? 'Sign Up' : 'Log In';

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
			<form onSubmit={doSubmit}>
				<header>
					<h1>{title}</h1>
				</header>

				<label>Email</label>
				<input
					className={`${validEmail ? 'valid' : 'invalid'}`}
					id="login-email"
					type="email"
					value={email}
					onChange={e => changeEmail(e.target.value)}
				/>

				<label>Password</label>
				<input
					className={`${validPass ? 'valid' : 'invalid'}`}
					id="login-password"
					type="password"
					value={password}
					onChange={e => changePassword(e.target.value)}
				/>
				<button type="submit" disabled={!validPass || !validEmail}>
					{title}
				</button>
			</form>

			<section>
				{isNew ? (
					<span>
						Existing User? <Link to="/sign/in">Log in</Link>
					</span>
				) : (
					<span>
						New User? <Link to="/sign/up">Sign up</Link>
					</span>
				)}
			</section>
		</>
	);
};

export default Login;
