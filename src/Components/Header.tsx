import React, { useContext, useEffect, useState } from 'react';
import Logo from '../Assets/FindASideLogo.png';
import './app.scss';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { Button, Popup } from 'semantic-ui-react';
import firebase from 'firebase';



export default function Header() {
    const [loading, setLoading] = useState(false);
    const userContext = useContext(UserContext);
    const handleLogOut = () => {
        firebase.auth().signOut()
            .then(() => {
                console.log('Logged out successfully');
                userContext?.dispatch({
                    type: 'LOG_OUT'
                });
                setLoading(false);
                history.push('/');
            })
            .catch(error => {
                console.log(error);
            });
    };

    const history = useHistory();

    useEffect(() => {
        setTimeout(() => {
            if (firebase.auth().currentUser) {
                setLoading(true);
            }
        }, 700);
    }, [loading]);

    return (
        <>
            <div className='header-container'>
                <div>
                    <img src={Logo} alt='Logo' onClick={() => history.push('/')} />
                </div>
                <div style={{ display: 'flex' }}>
                    {loading || userContext?.state.logged
                        ?
                        <>
                            {typeof firebase.auth().currentUser?.photoURL === 'string' ?
                                <>
                                    <Link to='/myaccount'>
                                        <Popup content='Click to go to your account' trigger={<img src={firebase.auth().currentUser?.photoURL?.toString()} alt='avatar' />} />
                                    </Link>
                                </>
                                : null
                            }
                            <Button style={{ height: '25%', alignSelf: 'center', margin: '0 50px 0 50px' }} onClick={handleLogOut}>LOG OUT</Button>
                        </>
                        :
                        <div className='header-p-container'>
                            <Link to='/login'>
                                <p>Login</p>
                            </Link>
                            <p>|</p>
                            <Link to='/signup'>
                                <p>Signup</p>
                            </Link>
                        </div>
                    }
                </div>
            </div>
            <div className='header-strap'>
                <p>Meet new friends</p>
                <p>Battle your enemies</p>
            </div>
        </>
    );
}
