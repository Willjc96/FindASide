import React, { useState, useContext } from 'react';
import { Button, Modal, Input } from 'semantic-ui-react';
import { firestore, auth } from '../Config/firebase';
import { useParams } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';

function LobbyModal() {
    const userContext = useContext(UserContext);
    let id: string = useParams();
    const [lobbyName, setLobbyName] = useState('');
    const [lobbyDescription, setLobbyDescription] = useState('');
    const user = { name: auth.currentUser?.displayName, game: id[0], id: auth.currentUser?.uid };


    const addLobby = async () => {
        if (user.name && user.id && id) {
            const db = await firestore.collection(id[0]);
            const dbUser = await db.doc(user.id).get();
            if (dbUser.exists) {
                console.log('Lobby Already Created');
            } else {
                db.doc(user.id).set({});
                await db.doc(user.id).collection('Users').doc(user.id).set({ Username: user.name, gameId: user.game, UserId: user.id, lobbyName: lobbyName, lobbyDescription: lobbyDescription });
                userContext?.dispatch({
                    type: 'SET_MODAL_CLOSED'
                });
            }
        } else {
            console.log('sign in');
        }
    };


    const handleInputs = (e: React.ChangeEvent<HTMLInputElement>, setStateFunction: React.Dispatch<React.SetStateAction<string>>) => {
        setStateFunction(e.target.value);
    };

    return (
        <Modal
            onClose={() => userContext?.dispatch({
                type: 'SET_MODAL_CLOSED'
            })}
            onOpen={() => userContext?.dispatch({
                type: 'SET_MODAL_OPEN'
            })}
            open={userContext?.state.modalOpen}
        >
            <Modal.Header>Set Up Your Lobby</Modal.Header>
            <Modal.Content >
                <Modal.Description>
                    <p>Enter Lobby Name</p>
                    <Input onChange={(e) => handleInputs(e, setLobbyName)} placeholder='Enter Lobby Name' />
                </Modal.Description>
                <Modal.Description>
                    <p>Enter Lobby Description</p>
                    <Input onChange={(e) => handleInputs(e, setLobbyDescription)} style={{ width: '100%' }} placeholder='Enter Lobby Description' />
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color='black' onClick={() => userContext?.dispatch({
                    type: 'SET_MODAL_CLOSED'
                })}>
                    Cancel
                </Button>
                <Button
                    content="Create, Lobby"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={addLobby}
                    positive
                />
            </Modal.Actions>
        </Modal>
    );
}

export default LobbyModal;