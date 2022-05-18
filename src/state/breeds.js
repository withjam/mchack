import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// export utility function
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

export const fetchAllBreeds = createAsyncThunk('breeds/fetchAll', async thunkAPI => {
	const resp = await fetch('https://dog.ceo/api/breeds/list/all', {
		method: 'GET',
	});
	const json = await resp.json();
	return json.message;
});

export const breedSlice = createSlice({
	name: 'breeds',
	initialState,
	reducers: {
		setBreeds: (state, action) => {
			// can set the breeds directly
			state.breeds = action.payload;
			state.mappedBreeds = mapBreeds(action.payload);
		},
	},
	extraReducers: builder => {
		builder.addCase(fetchAllBreeds.fulfilled, (state, action) => {
			// can set the breeds after a fetch call
			state.breeds = action.payload;
			state.mappedBreeds = mapBreeds(action.payload);
		});
	},
});

export const { setBreeds } = breedSlice.actions;

export default breedSlice.reducer;
