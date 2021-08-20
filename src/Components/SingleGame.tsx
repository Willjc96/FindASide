import React, { useCallback, useEffect, useState, useContext } from 'react';
import { games } from '../GamesList';
import { useParams } from 'react-router-dom';
import LobbyTable from './LobbyTable';
import { auth, firestore } from '../Config/firebase';
import { UserContext } from '../Context/UserContext';
import LobbyModal from './LobbyModal';

interface game {
    name: string;
    img: string;
    id: number;
    genre: string;
}
interface id {
    0: string;
}
interface lobbyObj {
    lobbyName?: string;
    userId?: string;
    userName?: string;
    lobbyDescription?: string;
    gameId?: string;
    lobbyCount?: string;
}


export default function SingleGame() {
    let id: id = useParams();
    const userContext = useContext(UserContext);
    const [selectedGame, setSelectedGame] = useState<null | game>(null);
    const [lobbyList, setLobbyList] = useState<[] | lobbyObj[]>([]);
    const [loading, setLoading] = useState(true);
    const user = { name: auth.currentUser?.displayName, game: id[0], id: auth.currentUser?.uid };
    const getAllLobbies = useCallback(async () => {
        const db = await firestore.collection(id[0]);
        const docRef = await db.get();
        const lobbyIdArray = docRef.docs.map((lobbyObj) => {
            return lobbyObj.id;
        });
        const lobbyNamesArray = await lobbyIdArray.map(async (lobbyId) => {
            let obj: lobbyObj = {};
            db.doc(lobbyId).collection('Users').get().then((res) => {
                const filtered = res.docs.filter(async (doc) => {
                    return doc.data().lobbyName;
                });
                obj.lobbyName = filtered[0].data().lobbyName;
                obj.userId = filtered[0].data().UserId;
                obj.userName = filtered[0].data().Username;
                obj.lobbyDescription = filtered[0].data().lobbyDescription;
                obj.gameId = filtered[0].data().gameId;
                obj.lobbyCount = res.docs.length.toString();
            });
            return obj;
        });
        const newLobbyNamesArray = Promise.all(lobbyNamesArray);

        newLobbyNamesArray.then((res) => {
            setTimeout(() => {
                setLoading(false);
                setLobbyList(res);
            }, 2000);
        });
    }, [id]);

    useEffect(() => {
        getAllLobbies();
    }, [getAllLobbies]);

    useEffect(() => {
        const gameSelected = games.filter(el => el.id === Number(id[0]));
        setSelectedGame(gameSelected[0]);
    }, [id]);

    return (
        <div>
            {userContext?.state.modalOpen && <LobbyModal />}
            {selectedGame
                ?
                <>
                    <div className='single-game-page-container'>
                        <h1>{selectedGame.name}</h1>
                        <h3>{selectedGame.genre}</h3>
                        <img src={selectedGame.img} alt='cover' className='single-game-page-image' />
                    </div>
                    <div>
                        <button onClick={() => { userContext?.dispatch({ type: 'SET_MODAL_OPEN' }); }}>Create Lobby</button>
                    </div>
                    <div className='single-game-page-table-container'>
                        {
                            loading
                                ? <p>'loading'</p>
                                : <>
                                    {console.log(lobbyList, 'loblist')}
                                    <LobbyTable lobbyList={lobbyList} />
                                </>
                        }
                    </div>
                </>
                :
                <p>Loading</p>}
        </div>
    );
}
