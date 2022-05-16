import Profile from "./Profile"

import './Home.scss';
import { BreedList } from "./BreedList";
import { useState } from "react";

export const Home = () => {
    const [showSidebar, setShowSidebar] = useState(false);
    return <section className="container">
        <section>
            <button onClick={() => {
                console.log('toggling sidebar');
                setShowSidebar(!showSidebar)
            }}>{showSidebar ? 'Close' : 'Open' }</button>
        <Profile />
        </section>
        <aside className={showSidebar ? 'opened' : 'closed'}>
            <header><h2>Breeds</h2></header>
            <BreedList />
        </aside>
    </section>
}

export default Home;