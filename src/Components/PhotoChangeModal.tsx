import React, { useContext, useState } from 'react';
import { Modal, Button } from 'semantic-ui-react';
import { auth } from '../Config/firebase';
import { UserContext } from '../Context/UserContext';
import { images } from '../AvatarList';

export default function PhotoChangeModal() {
    const userContext = useContext(UserContext);
    const [avatar, setAvatar] = useState('');
    const [error, setError] = useState('');

    const updateProfilePic = () => {
        if (typeof auth.currentUser?.photoURL === 'string' && avatar !== '') {
            return auth.currentUser?.updateProfile({
                photoURL: avatar
            }).then(() => {
                userContext?.dispatch({ type: 'SET_MODAL_CLOSED' });
            });
        } else {
            setError('Please pick an avatar or click cancel to keep the original');
        }
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
            <Modal.Header>
                Change Profile Picture
            </Modal.Header>
            <Modal.Content>
                <Modal.Description>
                    <p>
                        Choose your profile picture
                    </p>
                    {error && <p className='error-text'>{error}</p>}
                    <div className='single-avatar-container' style={{ maxHeight: '600px' }}>
                        {
                            images.map((image, i) => {
                                return (
                                    <img src={image.url.toString()} style={{ maxHeight: '160px' }} alt={`avatar${i}`} tabIndex={i} onClick={() => { setAvatar(image.url.toString()); }} />
                                );
                            })
                        }
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={updateProfilePic}>
                    Submit
                </Button>
                <Button onClick={() => userContext?.dispatch({ type: 'SET_MODAL_CLOSED' })}>
                    Cancel
                </Button>
            </Modal.Actions>
        </Modal>
    );
}
