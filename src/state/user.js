import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	authResult: null,
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login: (state, action) => {
			// add the authResult from a successul login
			state.authResult = action.payload;
			state.anonymous = false;
		},
		logout: state => {
			state.anonymous = true;
			state.authResult = null;
		},
	},
});

export const { login, logout } = userSlice.actions;

export default userSlice.reducer;
