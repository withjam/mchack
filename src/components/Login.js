import React, { useState } from 'react';

export const Login = onSubmit => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isNew, setIsNew] = useState(false);
	const title = isNew ? 'Sign Up' : 'Log In';
	return (
		<>
			<form>
				<header>
					<h1>{title}</h1>
				</header>
				<label>Email</label>
				<input id="login-email" type="email" value={email} onChange={e => setEmail(e.target.value)} />

				<label>Password</label>
				<input id="login-password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
				<button type="submit">{title}</button>
			</form>

			<section>
				{isNew ? (
					<span>
						Existing User?{' '}
						<button submit="false" onClick={() => setIsNew(false)}>
							Log in
						</button>
					</span>
				) : (
					<span>
						New User? <button onClick={() => setIsNew(true)}>Sign up</button>
					</span>
				)}
			</section>
		</>
	);
};
