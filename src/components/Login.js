import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SIMPLE_EMAIL_CHECK = /^(.+)@(.+)$/;

export const Login = props => {
	const { isNew } = props;
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [validPass, setValidPass] = useState(false);
	const [validEmail, setValidEmail] = useState(false);
	const title = isNew ? 'Sign Up' : 'Log In';

	function changeEmail(value) {
		setEmail(value);
		if (value && SIMPLE_EMAIL_CHECK.test(value)) {
			setValidEmail(true);
		} else {
			setValidEmail(false);
		}
	}

	function changePassword(value) {
		setPassword(value);
		if (value && value.length >= 6) {
			setValidPass(true);
		} else {
			setValidEmail(false);
		}
	}

	return (
		<>
			<form>
				<header>
					<h1>{title}</h1>
				</header>
				<label>Email</label>
				<input id="login-email" type="email" value={email} onChange={e => changeEmail(e.target.value)} />

				<label>Password</label>
				<input id="login-password" type="password" value={password} onChange={e => changePassword(e.target.value)} />
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
