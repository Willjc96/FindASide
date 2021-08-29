import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { firestore, auth } from '../Config/firebase';
import { useHistory } from 'react-router-dom';
import { Popup } from 'semantic-ui-react'

interface DocumentData {
    username?: string;
    lobbyName?: string;
    userId?: string;
}

interface params {
    gameId: string;
    lobbyId: string;
}

interface User {
    lobbyName?: string;
    userId?: string;
    userName?: string;
    lobbyDescription?: string;
    gameId?: string;
    lobbyCount?: string;
    lobbyAvatar?: string;
    lobbySize?: string;
    lobbyDifficulty?: string;
}

export default function SingleLobby() {
    const params: params = useParams();
    const [usersArray, setUsersArray] = useState<[] | DocumentData[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [full, setFull] = useState(false);
    const [host, setHost] = useState(false);
    const history = useHistory();
    const user = { username: auth.currentUser?.displayName, gameId: params.gameId, userId: auth.currentUser?.uid };


    const getDatabaseInfo = useCallback(async () => {
        const firstCollection = await firestore.collection(params.gameId);
        firstCollection.doc(params.lobbyId).collection('Users').get().then((res) => {
            const people = res.docs.map((doc) => {
                return doc.data()
            })
            setUsersArray(people)
        })

    }, [params.gameId, params.lobbyId])

    useEffect(() => {
        getDatabaseInfo()
    }, [getDatabaseInfo]);

    useEffect(() => {
        if (auth.currentUser?.uid === undefined) {
            setDisabled(true)
        };
    }, [])

    useEffect(() => {
        const check = async () => {
            const users: User[] = [];
            let totalUsers = 0;
            let maxUsers = 0;
            const firstCollection = await firestore.collection(params.gameId);
            const arr = await firstCollection.doc(params.lobbyId).collection('Users').get()
            await arr.forEach((item) => {
                users.push(item.data())
            })
            if (users.length) {
                totalUsers = users.length
            }
            await users.forEach((item) => {
                if (item.lobbySize) {
                    maxUsers = Number(item.lobbySize)
                }
            })
            if ((totalUsers !== 0 && totalUsers === maxUsers) || (maxUsers !== 0 && maxUsers === totalUsers)) {
                setDisabled(true);
                setFull(true);
            }
            const check = await (await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).get()).data();
            if (check !== undefined) {
                setDisabled(true)
                if (check.lobbySize) {
                    setHost(true)
                }
            }
        }
        check()
    }, [params.gameId, params.lobbyId, user.userId])


    const joinLobby = async () => {
        const firstCollection = await firestore.collection(params.gameId);
        const check = await (await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).get()).data();
        if (check === undefined) {
            await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).set(user)
            setDisabled(true)
        } else {
            console.log('already joined')
        }
    }

    const deleteLobby = async () => {
        const collection = await firestore.collection(params.gameId).doc(params.lobbyId);
        await collection.delete();
        history.push(`/games/${params.gameId}`);
    }

    const removeUser = async (username: string | undefined) => {
        if (typeof username === 'string') {
            const filter = usersArray.filter(item => item.username === username);
            await firestore.collection(params.gameId).doc(params.lobbyId).collection('Users').doc(filter[0].userId).delete();
            window.location.reload();
        }
    }

    return (
        <div>
            {usersArray
                ?
                <>
                    <button disabled={disabled} onClick={joinLobby}>Join Lobby</button>
                    {host && <Popup content='CLICK TO DELETE LOBBY' trigger={<button onClick={deleteLobby}>Delete Lobby</button>} />}
                    {full && <p>Lobby is full</p>}
                    {usersArray.map((user) => {
                        if (user.lobbyName) {
                            return <p>Host {user.username}</p>
                        } else {
                            return <Popup content='CLICK TO REMOVE USER' trigger={<p onClick={() => removeUser(user.username)}>{user.username}</p>} />
                        }

                    })}
                </>
                :
                <p>loading</p>
            }
        </div>
    );
}
