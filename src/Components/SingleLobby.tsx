import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { firestore, auth } from '../Config/firebase';
import { useHistory } from 'react-router-dom';
import { Popup, Icon, Form, Button } from 'semantic-ui-react';

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

interface DataObj {
    id: string;
    msg?: string;
    createdAt?: string;
    userId?: string;
}

export default function SingleLobby() {
    const params: params = useParams();
    const [usersArray, setUsersArray] = useState<[] | DocumentData[]>([]);
    const [disabled, setDisabled] = useState(false);
    const [full, setFull] = useState(false);
    const [host, setHost] = useState(false);
    const [leaveOption, setLeaveOption] = useState(false);
    const [chats, setChats] = useState<DataObj[] | []>([]);
    const history = useHistory();
    const [chatMessage, setChatMessage] = useState('');
    const user = { username: auth.currentUser?.displayName, gameId: params.gameId, userId: auth.currentUser?.uid };


    const getDatabaseInfo = useCallback(async () => {
        const firstCollection = await firestore.collection(params.gameId);
        firstCollection.doc(params.lobbyId).collection('Users').get().then((res) => {
            const people = res.docs.map((doc) => {
                return doc.data();
            });
            setUsersArray(people);
        });

    }, [params.gameId, params.lobbyId]);

    useEffect(() => {
        getDatabaseInfo();
    }, [getDatabaseInfo]);

    useEffect(() => {
        setTimeout(() => {
            if (auth.currentUser?.uid === undefined) {
                setDisabled(true);
            };
        }, 1000);
    }, []);

    useEffect(() => {
        const check = async () => {
            const users: User[] = [];
            let totalUsers = 0;
            let maxUsers = 0;
            const firstCollection = await firestore.collection(params.gameId);
            const arr = await firstCollection.doc(params.lobbyId).collection('Users').get();
            await arr.forEach((item) => {
                users.push(item.data());
            });
            if (users.length) {
                totalUsers = users.length;
            }
            await users.forEach((item) => {
                if (item.lobbySize) {
                    maxUsers = Number(item.lobbySize);
                }
            });
            if ((totalUsers !== 0 && totalUsers === maxUsers) || (maxUsers !== 0 && maxUsers === totalUsers)) {
                setDisabled(true);
                setFull(true);
            }
            const check = await (await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).get()).data();
            if (check !== undefined) {
                setDisabled(true);
                setLeaveOption(true);
                if (check.lobbySize) {
                    setHost(true);
                }
            }
        };
        check();
    }, [params.gameId, params.lobbyId, user.userId]);


    const joinLobby = async () => {
        const firstCollection = await firestore.collection(params.gameId);
        const check = await (await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).get()).data();
        if (check === undefined) {
            await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).set(user);
            setDisabled(true);
        } else {
            console.log('already joined');
        }
        window.location.reload();
    };

    const deleteLobby = async () => {
        deleteUsers();
        deleteMessages();
        const collection = await firestore.collection(params.gameId).doc(params.lobbyId);
        await collection.delete();
        history.push(`/games/${params.gameId}`);
    };

    const removeUser = async (username: string | undefined) => {
        if (typeof username === 'string') {
            const filter = usersArray.filter(item => item.username === username);
            await firestore.collection(params.gameId).doc(params.lobbyId).collection('Users').doc(filter[0].userId).delete();
            window.location.reload();
        }
    };

    const leaveLobby = async () => {
        await firestore.collection(params.gameId).doc(params.lobbyId).collection('Users').doc(auth.currentUser?.uid).delete();
        history.push(`/games/${params.gameId}`);
    };

    useEffect(() => {
        if (firestore) {
            const unsubscribe = firestore.collection(params.gameId).doc(params.lobbyId).collection('Chats').orderBy('createdAt').onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setChats(data);
            });
            return unsubscribe;
        }
    }, [params.lobbyId, params.gameId]);

    const addChat = async () => {
        if (chatMessage !== '') {
            await firestore.collection(params.gameId).doc(params.lobbyId).collection('Chats').doc((chats.length).toString()).set({ msg: chatMessage, createdAt: Date.now(), userId: auth.currentUser?.uid });
            setChatMessage('');
        }
    };

    const deleteMessages = async () => {
        firestore.collection(params.gameId).doc(params.lobbyId).collection('Chats').get()
            .then((querySnapshot) => {
                const batch = firestore.batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            });
    };

    const deleteUsers = async () => {
        firestore.collection(params.gameId).doc(params.lobbyId).collection('Users').get()
            .then((querySnapshot) => {
                const batch = firestore.batch();
                querySnapshot.forEach((doc) => {
                    batch.delete(doc.ref);
                });
                return batch.commit();
            });
    };

    return (
        <div>
            {usersArray
                ?
                <>
                    <button disabled={disabled} onClick={joinLobby}>Join Lobby</button>
                    {host && <Popup content='CLICK TO DELETE LOBBY' trigger={<button onClick={deleteLobby}>Delete Lobby</button>} />}
                    {!host && leaveOption && <Popup content='CLICK TO LEAVE LOBBY' trigger={<button onClick={leaveLobby}>Leave Lobby</button>} />}
                    {full && <p>Lobby is full</p>}
                    {usersArray.map((user) => {
                        if (user.lobbyName) {
                            return (
                                <div key={user.userId} style={{ display: 'flex' }}>
                                    <p>{user.username}</p>
                                    <Icon name='star' />
                                    <p>HOST</p>
                                </div>

                            );
                        } else if (host) {
                            return (
                                <div key={user.userId} style={{ display: 'flex' }}>
                                    <p>{user.username}</p>
                                    <Popup content='CLICK TO REMOVE USER' trigger={<Icon name='trash alternate outline' onClick={() => removeUser(user.username)} />} />
                                </div>
                            );
                        } else {
                            return <p key={user.userId}>{user.username}</p>;
                        }

                    })}
                </>
                :
                <p>loading</p>
            }
            <div style={{ border: '1px solid black', paddingTop: '50px' }}>
                <div style={{ border: '1px solid black', padding: '5%' }}>
                    {chats.map((chat, i) => {
                        if (chat.userId === user.userId) {
                            return <p key={i} style={{ color: 'red' }}>{chat.msg}</p>;
                        }
                        return <p key={i}>{chat.msg}</p>;
                    })}
                </div>
                <div style={{ margin: '1%' }}>
                    <Form onSubmit={addChat}>
                        <Form.Field>
                            <input value={chatMessage} disabled={!disabled} onChange={(e) => setChatMessage(e.target.value)} placeholder='Enter Your Message'></input>
                        </Form.Field>
                        <Popup disabled={disabled} content='Please join lobby to chat' trigger={<Button>Send Message</Button>} />
                    </Form>
                </div>
            </div>
        </div>
    );
}
