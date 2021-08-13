import React, { useContext } from 'react';
import Logo from '../Assets/FindASideLogo.png';
import './app.scss';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { Button } from 'semantic-ui-react';
import firebase from 'firebase';


export default function Header() {
    const userContext = useContext(UserContext);
    const handleLogOut = () => {
        firebase.auth().signOut()
            .then(() => {
                console.log('Logged out successfully');
                userContext?.dispatch({
                    type: 'LOG_OUT'
                });
            })
            .catch(error => {
                console.log(error);
            });

    };

    const history = useHistory();
    return (
        <>
            {console.log(firebase.auth().currentUser, 'userrrrrr')}
            <div className='header-container'>
                <img src={Logo} alt='Logo' onClick={() => history.push('/')} />
                {userContext?.state.logged
                    ?
                    <>
                        {typeof firebase.auth().currentUser?.photoURL === 'string' ?

                            <>
                                <p>{firebase.auth().currentUser?.displayName}</p>
                                {/* <img src={firebase.auth().currentUser?.photoURL} alt='avatar'/> */}
                            </>
                            : null
                        }


                        <Button onClick={handleLogOut}>Log Out</Button>
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
            <div className='header-strap'>
                <p>Meet new friends</p>
                <p>Battle your enemies</p>
            </div>
        </>
    );
}
