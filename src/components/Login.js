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

	// if already logged in, redirect to home
	if (isAnonymous === false) {
		return <Navigate to="/" />;
	}

	function doSubmit(ev) {
		ev.preventDefault();
		console.log('trigger');
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
			<div className="p-3 px-6 min-h-48 flex justify-center items-center">
				<div className="flex flex-col max-w-md p-6 rounded-md sm:p-10 bg-zinc-100 text-zinc-900 dark:bg-coolGray-900 dark:text-coolGray-100">
					<div className="mb-8 text-center">
						<h1 className="my-3 text-4xl font-bold">{title}</h1>
						<p className="text-sm dark:text-coolGray-400">
							{title} to {isNew ? 'create your account' : 'access your account'}
						</p>
					</div>
					<form onSubmit={doSubmit} className="space-y-12 ng-untouched ng-pristine ng-valid">
						<div className="space-y-4">
							<div>
								<label htmlFor="email" className="block mb-2 text-sm">
									Email address
								</label>
								<input
									type="email"
									name="email"
									id="email"
									placeholder="jane.doe@example.com"
									value={email}
									onChange={e => changeEmail(e.target.value)}
									className={`w-full px-3 py-2 border rounded-md border-zinc-200 bg-zinc-200 text-zinc-900 outline-2 outline-violet-500/50 ${
										validEmail ? 'valid' : 'invalid'
									}`}
								/>
							</div>
							<div>
								<div className="flex justify-between mb-2">
									<label htmlFor="password" className="text-sm">
										Password
									</label>
									{!isNew && (
										<a
											rel="noopener noreferrer"
											href="/"
											className="text-xs hover:underline dark:text-coolGray-400 outline-2 outline-violet-500/50"
										>
											Forgot password?
										</a>
									)}
								</div>
								<input
									type="password"
									name="password"
									id="password"
									placeholder="*****"
									value={password}
									onChange={e => changePassword(e.target.value)}
									className={`w-full px-3 py-2 border rounded-md border-zinc-200 bg-zinc-200 text-zinc-900 outline-2 outline-violet-500/50 ${
										validPass ? 'valid' : 'invalid'
									}`}
								/>
							</div>
						</div>
						<div className="space-y-2">
							<div>
								<button
									type="submit"
									disabled={!validPass || !validEmail}
									className="w-full px-8 py-3 rounded-md bg-violet-700 text-zinc-100 dark:bg-violet-400 dark:text-coolGray-900"
								>
									{title}
								</button>
							</div>
							<p className="px-6 text-sm text-center dark:text-coolGray-400">
								{isNew ? 'Already have an account?' : "Don't have an account yet?"}
								{` `}
								<Link
									to={`${isNew ? '/sign/in' : '/sign/up'}`}
									className="hover:underline dark:text-violet-400 outline-2 outline-violet-500/50"
								>
									{isNew ? 'Log In' : 'Sign Up'}
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};

export default Login;
