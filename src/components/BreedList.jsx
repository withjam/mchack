import { useSelector } from 'react-redux';
import { mappedBreedsSelector } from 'state';

export const BreedList = () => {
	const mappedBreeds = useSelector(mappedBreedsSelector);

	return (
		<>
			<strong>
				{mappedBreeds.length} breed{mappedBreeds.length === 1 ? '' : 's'}
			</strong>
			<ul>
				{mappedBreeds.map((breed, i) => (
					<li key={breed || i}>{breed}</li>
				))}
			</ul>
		</>
	);
};
