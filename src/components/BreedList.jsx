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

// // what not to do
// let mappedBreeds = [];
// console.log('fetching data');
// fetch('https://dog.ceo/api/breeds/list/all', {
// 	method: 'GET',
// }).then(resp => {
// 	resp.json().then(data => {
// 		console.log('got data', data.message);
// 		mappedBreeds = mapBreeds(data.message);
// 		console.log('got mapped breeds', mappedBreeds);
// 	});
// });

// // what to do
// const [breeds, setBreeds] = useState({});
// const mappedBreeds = useMemo(() => {
// 	return mapBreeds(breeds);
// }, [breeds]);

// useEffect(() => {
// 	const controller = new AbortController();
// 	(async function fetchBreeds() {
// 		console.log('fetching breeds');
// 		const resp = await fetch('https://dog.ceo/api/breeds/list/all', {
// 			method: 'GET',
// 			signal: controller.signal,
// 		});
// 		const json = await resp.json();
// 		console.log('setting breeds', json.message);
// 		setBreeds(json.message);
// 	})();
// 	return () => {
// 		console.log('aborting fetch breeds');
// 		controller.abort();
// 	};
// }, []);
