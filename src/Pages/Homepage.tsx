import React from 'react';
import HomepageGreeting from '../Components/HomepageGreeting2';
import GamingCategories from '../Components/GamingCategories';
import { games } from '../GamesList';

export default function Homepage() {

    const sports = games.filter(el => el.genre === 'sport');
    const shooter = games.filter(el => el.genre === 'shooter');
    
    return (
        <div className='page-container'>
            <HomepageGreeting />
            <GamingCategories category='sports' games={sports} />
            <GamingCategories category='shooter' games={shooter} />
        </div>
    );
}
