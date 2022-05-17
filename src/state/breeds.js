import { createSlice } from '@reduxjs/toolkit';
export function mapBreeds(breeds) {
	const breedNames = Object.keys(breeds);
	console.log('mapping breeds', breeds, breedNames);
	return breedNames.reduce((acc, name) => {
		const breed = breeds[name];
		if (breed.length) {
			acc.push(...breed.map(sub => `${name}, ${sub}`));
		} else {
			acc.push(name);
		}
		return acc;
	}, []);
}

const initialState = {
	breeds: {},
	mappedBreeds: [],
};

export const breedSlice = createSlice({
	name: 'breeds',
	initialState,
	reducers: {
		setBreeds: (state, action) => {
			// add the authResult from a successul login
			state.breeds = action.payload;
			state.mappedBreeds = mapBreeds(action.payload);
		},
	},
});

export const { setBreeds } = breedSlice.actions;

export default breedSlice.reducer;
