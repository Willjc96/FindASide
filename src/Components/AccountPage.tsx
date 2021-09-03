import React, { useContext } from 'react';
import { auth } from '../Config/firebase';
import { UserContext } from '../Context/UserContext';
import PhotoChangeModal from './PhotoChangeModal';

export default function AccountPage() {
    const userContext = useContext(UserContext);
    return (
        <div>
            {userContext?.state.modalOpen && <PhotoChangeModal />}
            <p>Username: {auth.currentUser?.displayName}</p>
            <img src={auth.currentUser?.photoURL?.toString()} style={{ maxHeight: '160px' }} alt='proficle pic'></img>
            <button onClick={() => userContext?.dispatch({ type: 'SET_MODAL_OPEN' })}>Change Profile Picture</button>
        </div>
    );
}
