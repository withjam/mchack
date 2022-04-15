import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user';

export const store = configureStore({
	reducer: {
		user: userReducer,
	},
});

export const userSelector = state => state.user;
export const userProfileSelector = state => userSelector(state).profile;
export const isAnonymousSelector = state => !state.user || state.user.anonymous;
