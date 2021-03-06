import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router';
import { firestore, auth } from '../Config/firebase';
import { useHistory } from 'react-router-dom';
import { Popup, Icon, Form, Button } from 'semantic-ui-react';
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
    username?: string;
    lobbyName?: string;
}


export default function SingleLobby() {
    const params: params = useParams();
    const [disabled, setDisabled] = useState(false);
    const [full, setFull] = useState(false);
    const [host, setHost] = useState(false);
    const [leaveOption, setLeaveOption] = useState(false);
    const [chats, setChats] = useState<DataObj[] | []>([]);
    const history = useHistory();
    const [chatMessage, setChatMessage] = useState('');
    const [lobbySize, setLobbySize] = useState('');
    const [currentUsers, setCurrentUsers] = useState('');
    const [joined, setJoined] = useState(false);
    const messagesEndRef = useRef<HTMLHeadingElement>(null);
    const [newUsers, setNewUsers] = useState<[] | DataObj[]>([]);
    const [logged, setLogged] = useState(false);
    const user = { username: auth.currentUser?.displayName, gameId: params.gameId, userId: auth.currentUser?.uid };

    useEffect(() => {
        setTimeout(() => {
            if (auth.currentUser?.uid === undefined) {
                setDisabled(true);
            } else {
                setLogged(true);
            }
        }, 300);
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
                setCurrentUsers(users.length.toString());
            }
            await users.forEach((item) => {
                if (item.lobbySize) {
                    maxUsers = Number(item.lobbySize);
                    setLobbySize(item.lobbySize);
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
    }, [params.gameId, params.lobbyId, user.userId, newUsers]);


    const joinLobby = async () => {
        const firstCollection = await firestore.collection(params.gameId);
        const check = await (await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).get()).data();
        if (check === undefined) {
            await firstCollection.doc(params.lobbyId).collection('Users').doc(user.userId).set(user);
            setDisabled(true);
        }
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
            const filter = newUsers.filter(item => item.username === username);
            await firestore.collection(params.gameId).doc(params.lobbyId).collection('Users').doc(filter[0].userId).delete();
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

    useEffect(() => {
        if (firestore) {
            const unsubscribe = firestore.collection(params.gameId).doc(params.lobbyId).collection('Users').onSnapshot(querySnapshot => {
                const data = querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                setNewUsers(data);
            });
            return unsubscribe;
        }
    }, [params.lobbyId, params.gameId]);

    const addChat = async () => {
        if (chatMessage !== '') {
            await firestore.collection(params.gameId).doc(params.lobbyId).collection('Chats').doc((chats.length).toString()).set({ msg: chatMessage, createdAt: Date.now(), userId: auth.currentUser?.uid, username: user.username });
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

    useEffect(() => {
        if (null !== messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: 'nearest', inline: 'start' });
        }
    }, [chats]);

    useEffect(() => {
        newUsers.forEach((item) => {
            if (auth.currentUser?.uid === item.userId) {
                setJoined(true);
            }
        });
    }, [newUsers]);

    return (
        <div>
            {newUsers
                ?
                <>
                </>
                :
                <p>loading</p>
            }
            <div className='lobby-container'>
                <div className='boxes-container'>
                    <div className='lobby-content-box' >
                        {chats.map((chat, i) => {
                            if (chat.userId === user.userId) {
                                return (
                                    <div key={i} style={{ color: 'red', textAlign: 'right' }}>
                                        <p>{chat.msg}</p>
                                    </div>
                                );
                            }
                            return (
                                <div style={{ display: 'flex', paddingTop: '20px' }} key={i}>
                                    <p style={{ fontWeight: 'bolder', paddingRight: '5px' }}>
                                        {chat.username}:
                                    </p>
                                    <p>
                                        {chat.msg}
                                    </p>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef}></div>
                    </div>
                    {(full && joined) || (!full && logged) ?
                        <div style={{ margin: '1% 0 2% 0' }}>
                            <Form onSubmit={addChat}>
                                <Form.Field>
                                    <input value={chatMessage} disabled={disabled === false} onChange={(e) => setChatMessage(e.target.value)} placeholder='Enter Your Message'></input>
                                </Form.Field>
                                <Popup disabled={disabled} content='Please join lobby to chat' trigger={<Button>Send Message</Button>} />
                            </Form>
                        </div>
                        :
                        <input placeholder='Please log in to send a message...' disabled style={{ width: '100%', margin: '10px 0px 10px 0px', padding: '10px 0px 10px 20px' }} />
                    }
                </div>
                <div className='boxes-container'>
                    <div className='lobby-content-box-right'>
                        <div>
                            <h3>Lobby Size {currentUsers}/{lobbySize}</h3>
                            {full && <p>Lobby is full</p>}
                        </div>
                        <div style={{ paddingTop: '10px' }}>
                            <h3 style={{ textDecoration: 'underline' }}>Members</h3>
                            {newUsers.map((userObj) => {
                                if (host) {
                                    return (
                                        <div key={userObj.userId} style={{ display: 'flex', justifyContent: 'center' }}>
                                            {user.username !== userObj.username ?
                                                <>
                                                    <p>{userObj.username}</p>
                                                    <Popup content='CLICK TO REMOVE USER' trigger={<Icon name='trash alternate outline' onClick={() => removeUser(userObj.username)} />} />
                                                </>
                                                :
                                                <>
                                                    <p>{userObj.username}</p>
                                                    <Icon name='star' />
                                                    <p>HOST</p>
                                                </>
                                            }
                                        </div>
                                    );
                                }
                                else {
                                    return (
                                        <div key={userObj.userId} style={{ display: 'flex', justifyContent: 'center' }}>
                                            {userObj.lobbyName ?
                                                <>
                                                    <p>{userObj.username}</p>
                                                    <Icon name='star' />
                                                    <p>HOST</p>
                                                </>
                                                :
                                                <>
                                                    <p>{userObj.username}</p>
                                                </>
                                            }
                                        </div>
                                    );
                                }
                            })}
                            <div style={{ paddingTop: '10px' }}>
                                {host && <Popup content='CLICK TO DELETE LOBBY' trigger={<Button onClick={deleteLobby}>Delete Lobby</Button>} />}
                            </div>
                            <div style={{ paddingTop: '10px' }} >
                                <Button disabled={disabled} onClick={joinLobby}>Join Lobby</Button>
                            </div>
                            <div style={{ paddingTop: '10px' }}>
                                {!host && leaveOption && <Popup content='CLICK TO LEAVE LOBBY' trigger={<Button onClick={leaveLobby}>Leave Lobby</Button>} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
