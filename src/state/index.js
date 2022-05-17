import { configureStore } from '@reduxjs/toolkit';
import user from './user';
import breeds from './breeds';

console.log('store/index.js has loaded');

export const store = configureStore({
	reducer: {
		user,
		breeds,
	},
});

export const userSelector = state => state.user;
export const userProfileSelector = state => userSelector(state).profile;
export const isAnonymousSelector = state => !state.user || state.user.anonymous;
export const mappedBreedsSelector = state => state.breeds.mappedBreeds;
