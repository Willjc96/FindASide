import React, { useEffect, useState } from 'react';
import { games } from '../GamesList';
import { useParams } from 'react-router-dom';
import LobbyTable from './LobbyTable';
import { firestore, auth } from '../Config/firebase';

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
    const [lobbyArray, setLobbyArray] = useState<[] | string[]>([]);
    const [user, setUser] = useState({name: auth.currentUser?.displayName, game: selectedGame?.id, id: auth.currentUser?.uid})

    useEffect(() => {
            const gameSelected = games.filter(el => el.id === Number(id[0]))
            setSelectedGame(gameSelected[0])
    }, [id])

    useEffect(() => {
        const getAllLobbies = async () => {
            if (user.name && user.id && typeof selectedGame?.id.toString() === 'string') {
                const lobbyArr: string[] = [];
                const docRef = await firestore.collection(selectedGame?.id.toString()).get()
                    docRef.docs.forEach((doc) => {
                        if(doc.id) {
                            lobbyArr.push(doc.id)
                            setLobbyArray(lobbyArr)
                        }
                        
                })
            }
        }
        getAllLobbies()
    },[])


    const addLobby = async () => {
        if (user.name && user.id !== '' && typeof selectedGame?.id.toString() === 'string') {
            const db = await firestore.collection(selectedGame.id.toString())
            const dbUser = await db.doc(user.id).get();
            if (dbUser.exists){
                console.log('Lobby Already Created')
            } else {
              db.doc(user.id).set({});
              await db.doc(user.id).collection('Users').doc(user.id).set(user)
            }
        } else {
            console.log('sign in')
        }        
    }

    const joinLobby = async (lobbyId: string) => {
        if (user.name && user.id !== '' && typeof selectedGame?.id.toString() === 'string') {
            const db = await firestore.collection(selectedGame.id.toString())
            await db.doc(lobbyId).collection('Users').doc(user.id).set(user)
        }
    }


    return (
        <div>
            {selectedGame 
            ?
            <>
            <div className='single-game-page-container'>
                <h1>{selectedGame.name}</h1>
                <h3>{selectedGame.genre}</h3>
                <img src={selectedGame.img} alt='cover' className='single-game-page-image'/>
                <button onClick={addLobby}>Create lobby</button>
            </div>
            <div>
                {lobbyArray.map((lobbyID) => {
                    return (
                        <div style={{border: '3px white solid', padding: '30px'}}>
                            <p>{lobbyID}</p>
                            <button onClick={() => joinLobby(lobbyID)}>Join</button>
                        </div>
                    )
                })}
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
