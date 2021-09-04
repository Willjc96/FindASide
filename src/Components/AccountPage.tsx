import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'semantic-ui-react';
import { auth } from '../Config/firebase';
import { UserContext } from '../Context/UserContext';
import PhotoChangeModal from './PhotoChangeModal';

export default function AccountPage() {
    const userContext = useContext(UserContext);
    const [loader, setLoader] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            setLoader(false);
        }, 1000);
    }, []);

    return (
        <div>
            {!loader ?
                <div style={{ paddingTop: '50px' }}>

                    <div className='account-details-container'>
                        {userContext?.state.modalOpen && <PhotoChangeModal />}
                        <div >
                            <p className='account-header'>
                                Username: <span className='account-details'>{auth.currentUser?.displayName}</span>
                            </p>
                            <p className='account-header'>
                                Email Address: <span className='account-details'>{auth.currentUser?.email}</span>
                            </p>
                            <p className='account-header'>
                                Profile Picture: <span className='account-details'><Button onClick={() => userContext?.dispatch({ type: 'SET_MODAL_OPEN' })}>
                                    Change Profile Picture
                                </Button></span>
                            </p>
                        </div>
                    </div>
                </div>
                : <div className='loading-container-account'>
                    <img src='https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif' alt='loader' />
                    <h3>Loading Account Details</h3>
                </div>
            }
        </div>
    );
}
