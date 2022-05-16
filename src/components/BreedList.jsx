import { useEffect, useState } from "react";

function sortByName(v1, v2) {
    console.log('sorting user by name', v1);
    return v1.name - v2.name;
}

function mapBreeds(breeds) {
    const breedNames = Object.keys(breeds);
    console.log('mapping breeds', breeds, breedNames);
    return breedNames.reduce((acc, name) => {
        const breed = breeds[name];
        console.log('mapping breed', name, breed);
        acc.push(breed.length ? breed.map(sub => `${name} ${sub}`) : breed);
        return acc;
    }, [])
}


export const BreedList = () => {
    const [breeds, setBreeds] = useState({});
    const mappedBreeds = mapBreeds(breeds);

    async function fetchBreeds() {
        console.log('fetching breeds');
        const resp = await fetch('https://dog.ceo/api/breeds/list/all', {
            method: 'GET'
        });
        const json = await resp.json();
        setBreeds(json.message);
    }

    useEffect(() => {
        fetchBreeds();
    }, []);
    
    
    return <ul>{
        mappedBreeds.map(breed => <li key={breed}>{breed}</li>)
    }</ul>
}