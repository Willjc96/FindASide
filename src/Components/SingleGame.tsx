import React, { useEffect, useState, useContext, useCallback } from 'react';
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
    id?: string;
    lobbyName?: string;
}

export default function SingleGame() {
    const userContext = useContext(UserContext)
    let id: string = useParams()
    const [selectedGame, setSelectedGame] = useState<null | game>(null);
    const [loading, setLoading] = useState(false);
    const [lobbyArray, setLobbyArray] = useState<[] | lobbyObj[]>([]);
    const user = { name: auth.currentUser?.displayName, game: id[0], id: auth.currentUser?.uid };


    const getAllLobbies = useCallback(async () => {
        if (user.name && user.id && id[0]) {
            const docRef = await firestore.collection(id[0]).get()
            const db = await firestore.collection(id[0]);
            const lobbyArr = docRef.docs.map((doc) => {
                return doc.id
            })
            const lobbies = await lobbyArr.map(async (lobbyId) => {
                let obj: lobbyObj = {};
                db.doc(lobbyId).collection('Users').get().then((res) => {
                    const filtered = res.docs.filter(async (doc) => {
                        return doc.data().lobbyName
                    })
                    obj.lobbyName = filtered[0].data().lobbyName;
                    obj.id = lobbyId
                })
                return obj
            })
            const newLobs = Promise.all(lobbies)
            setTimeout(() => {
                newLobs.then((res) => {
                    setTimeout(() => {
                        setLobbyArray(res)
                        setLoading(true)
                    }, 1000)

                })
            })


        }
    },
        [id, user.id, user.name],
    );

    useEffect(() => {
        getAllLobbies()
    }, [getAllLobbies])


    useEffect(() => {
        const gameSelected = games.filter(el => el.id === Number(id[0]))
        setSelectedGame(gameSelected[0]);
    }, [id, user.id, user.name])

    const joinLobby = async (lobbyId: string | undefined) => {
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
                        <p>Hi</p>
                        {loading
                            ?
                            <>
                                {lobbyArray.map((lobby) => {
                                    return (
                                        <div key={lobby.id} style={{ border: '3px white solid', padding: '30px' }}>
                                            <p>{lobby.lobbyName}</p>
                                            <Link to={`/lobby/${id[0]}/${lobby.id}`}>
                                                <button onClick={() => joinLobby(lobby.id)}>Join Lobby</button>
                                            </Link>
                                        </div>
                                    )
                                })}
                            </>
                            :
                            <p>Loading</p>}
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
