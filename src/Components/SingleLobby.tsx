import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { firestore, auth } from '../Config/firebase';

interface DocumentData {
    username?: string;
    lobbyName?: string;
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

    return (
        <div>
            {usersArray
                ?
                <>
                    <button disabled={disabled} onClick={joinLobby}>Join Lobby</button>
                    {full && <p>Lobby is full</p>}
                    {usersArray.map((user) => {
                        if (user.lobbyName) {
                            return <p>Host {user.username}</p>
                        } else {
                            return <p> UserName - {user.username}</p>
                        }

                    })}
                </>
                :
                <p>loading</p>
            }
        </div>
    );
}
