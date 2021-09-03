import React, { useCallback, useEffect, useState, useContext } from 'react';
import { games } from '../GamesList';
import { useParams } from 'react-router-dom';
import LobbyTable from './LobbyTable';
import { firestore, auth } from '../Config/firebase';
import { UserContext } from '../Context/UserContext';
import LobbyModal from './LobbyModal';
import { Button } from 'semantic-ui-react';

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
    lobbyAvatar?: string;
    lobbySize?: string;
    lobbyDifficulty?: string;
    lobbyConsole?: string;
}


export default function SingleGame() {
    let id: id = useParams();
    const userContext = useContext(UserContext);
    const [selectedGame, setSelectedGame] = useState<null | game>(null);
    const [lobbyList, setLobbyList] = useState<[] | lobbyObj[]>([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(true);


    const getAllLobbies = useCallback(async () => {
        const db = await firestore.collection(id[0]);
        const docRef = await db.get();
        const lobbyIdArray = docRef.docs.map((lobbyObj) => {
            return lobbyObj.id;
        });
        const lobbyNamesArray = await lobbyIdArray.map(async (lobbyId) => {
            if (auth.currentUser?.uid === lobbyId) {
                setShow(false);
            }
            let obj: lobbyObj = {};
            db.doc(lobbyId).collection('Users').get().then((res) => {
                const filtered = res.docs.filter(doc => doc.data().lobbyName);
                obj.lobbyName = filtered[0].data().lobbyName;
                obj.userId = filtered[0].data().userId;
                obj.userName = filtered[0].data().username;
                obj.lobbyDescription = filtered[0].data().lobbyDescription;
                obj.gameId = filtered[0].data().gameId;
                obj.lobbyAvatar = filtered[0].data().lobbyAvatar;
                obj.lobbyCount = res.docs.length.toString();
                obj.lobbySize = filtered[0].data().lobbySize;
                obj.lobbyDifficulty = filtered[0].data().lobbyDifficulty;
                obj.lobbyConsole = filtered[0].data().lobbyConsole;
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
        window.scrollTo(0, 0);
    }, []);

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
                        <h1>{selectedGame.name.toUpperCase()}</h1>
                        <img src={selectedGame.img} alt='cover' className='single-game-page-image' />
                    </div>

                    {
                        loading
                            ?
                            <div className='loading-container'>
                                <img src='https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif' alt='loader' />
                                <h3>Loading Lobbies Please Wait</h3>
                            </div>
                            :
                            <div className='lobby-table-container'>
                                {auth.currentUser?.uid !== undefined && show
                                    &&
                                    <div>
                                        <Button onClick={() => { userContext?.dispatch({ type: 'SET_MODAL_OPEN' }); }}>Create Lobby</Button>
                                    </div>
                                }
                                {lobbyList.length
                                    ?
                                    <div className='single-game-page-table-container'>
                                        <LobbyTable lobbyList={lobbyList} />
                                    </div>
                                    :
                                    <div>
                                        <h3>Be The First To Create A Lobby...</h3>
                                    </div>
                                }

                            </div>
                    }
                </>
                :
                <p>Loading</p>}
        </div>
    );
}
