import React from 'react';
import { useHistory } from 'react-router-dom';

interface iProps {
    category: string;
    games: { name: string, img: string; }[];
}

export default function GamingCategories(props: iProps) {
    const history = useHistory();
    const { category, games } = props;
    if (!games) {
        return (
            <p>Loading...</p>
        );
    }
    return (
        <div className='homepage-main-container'>
            <h2>{category}</h2>
            <div className='game-category-container'>
                {games.map((game) => {
                    return (
                        <div onClick={() => {
                            history.push(`games/${game.name.replace(/\s/g, '')}`);
                        }} className='single-game-container'>
                            <img src={game.img} alt={game.name} />
                            <h4>
                                {game.name}
                            </h4>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
