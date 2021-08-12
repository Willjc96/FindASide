import React, { useEffect, useState } from 'react';
import { games } from '../GamesList';
import { useParams } from 'react-router-dom';
import LobbyTable from './LobbyTable';

interface game {
    name: string;
    img: string;
    id: number;
    genre: string;
}
interface id {
    0: string 
}

export default function SingleGame() {
    let id: id = useParams()
    const [selectedGame, setSelectedGame] = useState< null | game>(null);

    useEffect(() => {
            const gameSelected = games.filter(el => el.id === Number(id[0]))
            setSelectedGame(gameSelected[0])  
    }, [id])

    return (
        <div>
            {console.log(id)}
            {selectedGame 
            ?
            <>
            <div className='single-game-page-container'>
                <h1>{selectedGame.name}</h1>
                <h3>{selectedGame.genre}</h3>
                <img src={selectedGame.img} alt='cover' className='single-game-page-image'/>
            </div>
            <div className='single-game-page-table-container'>
                <LobbyTable />
            </div>
            </>
            :
            <p>Loading</p> }
        </div>
    )
}
