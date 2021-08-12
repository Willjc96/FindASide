import React from 'react';
import Logo from '../Assets/FindASideLogo.png';
import './app.scss';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';


export default function Header() {

    const history = useHistory();
    return (
        <>
            <div className='header-container'>
                <img src={Logo} alt='Logo' onClick={() => history.push('/')} />
                <div className='header-p-container'>
                    <Link to='/login'>
                        <p>Login</p>
                    </Link>
                    <p>|</p>
                    <Link to='/signup'>
                        <p>Signup</p>
                    </Link>
                </div>
            </div>
            <div className='header-strap'>
                <p>Meet new friends</p>
                <p>Battle your enemies</p>
            </div>
        </>
    );
}
