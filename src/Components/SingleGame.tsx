import React, { useEffect, useState, useContext } from 'react';
import { games } from '../GamesList';
import { Link, useParams } from 'react-router-dom';
import LobbyTable from './LobbyTable';
import { firestore, auth } from '../Config/firebase';
import LobbyModal from './LobbyModal';
import { UserContext } from '../Context/UserContext'

interface game {
    name: string;
    img: string;
    id: number;
    genre: string;
}

interface lobbyObj {
    id: string;
    lobbyName: string;
}

export default function SingleGame() {
    const userContext = useContext(UserContext)
    let id: string = useParams()
    const [selectedGame, setSelectedGame] = useState<null | game>(null);
    const [lobbyArray, setLobbyArray] = useState<[] | lobbyObj[]>([]);
    const user = { name: auth.currentUser?.displayName, game: id[0], id: auth.currentUser?.uid };


    useEffect(() => {
        const gameSelected = games.filter(el => el.id === Number(id[0]))
        setSelectedGame(gameSelected[0]);
        const getAllLobbies = async () => {
            if (user.name && user.id && id[0]) {
                const docRef = await firestore.collection(id[0]).get()
                const db = await firestore.collection(id[0]);
                const lobbyArr = docRef.docs.map((doc) => {
                    return doc.id
                })
                lobbyArr.forEach((lobbyId) => {
                    db.doc(lobbyId).collection('Users').get().then((res) => {
                        const filtered = res.docs.filter((doc) => {
                            return doc.data().lobbyName
                        })
                        const lobbyNameArray = filtered.map((lobby) => {
                            return { lobbyName: lobby.data().lobbyName, id: lobbyId }
                        })
                        setLobbyArray(lobbyNameArray)
                    })
                })

            }
        }
        getAllLobbies();
    }, [id, user.id, user.name])

    const joinLobby = async (lobbyId: string) => {
        if (user.name && user.id && id) {
            const db = await firestore.collection(id[0])
            let check = await (await db.doc(lobbyId).collection('Users').doc(user.id).get()).data();
            if (!check) {
                await db.doc(lobbyId).collection('Users').doc(user.id).set(user)
            } else {
                console.log('already joined lobby')
            }
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
                        <img src={selectedGame.img} alt='cover' className='single-game-page-image' />
                        <button onClick={() => userContext?.dispatch({
                            type: 'SET_MODAL_OPEN'
                        })}>Create lobby</button>
                    </div>
                    <div>
                        {lobbyArray.map((lobbyID, i) => {
                            return (
                                <div key={i} style={{ border: '3px white solid', padding: '30px' }}>
                                    <p>{lobbyID.lobbyName}</p>
                                    <Link to={`/lobby/${id[0]}/${lobbyID.id}`}>
                                        <button onClick={() => joinLobby(lobbyID.id)}>View Lobby</button>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                    <div className='single-game-page-table-container'>
                        <LobbyTable />
                    </div>
                    {userContext?.state.modalOpen && <LobbyModal />}
                </>
                :
                <p>Loading</p>}
        </div>
    )
}
