import React from 'react';
import HomepageGreeting from '../Components/HomepageGreeting2';
import GamingCategories from '../Components/GamingCategories';
import { games } from '../GamesList';

export default function Homepage() {

    const sports = games.filter(el => el.genre === 'Sport');
    const shooter = games.filter(el => el.genre === 'Shooter');
    const racing = games.filter(el => el.genre === 'Racing');
    const openWorld = games.filter(el => el.genre === 'OpenWorld');
    const moba = games.filter(el => el.genre === 'MOBA');
    const fighter = games.filter(el => el.genre === 'Fighter');

    return (
        <div className='page-container'>
            <HomepageGreeting />
            <GamingCategories category='Sports' games={sports} />
            <GamingCategories category='Shooter' games={shooter} />
            <GamingCategories category='Racing' games={racing} />
            <GamingCategories category='Open World' games={openWorld} />
            <GamingCategories category='MOBA' games={moba} />
            <GamingCategories category='Fighter' games={fighter} />
        </div>
    );
}
