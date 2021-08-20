import React from 'react';
import HomepageGreeting from '../Components/HomepageGreeting2';
import GamingCategories from '../Components/GamingCategories';
import { games } from '../GamesList';

export default function Homepage() {

    const sports = games.filter(el => el.genre === 'Sport');
    const shooter = games.filter(el => el.genre === 'Shooter');
    
    return (
        <div className='page-container'>
            <HomepageGreeting />
            <GamingCategories category='Sports' games={sports} />
            <GamingCategories category='Shooter' games={shooter} />
        </div>
    );
}
