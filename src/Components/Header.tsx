import React from 'react';
import Logo from '../Assets/FindASideLogo.png';
import './app.scss';
import { useHistory } from 'react-router';

export default function Header() {

    const history = useHistory();
    return (
        <>
            <div className='header-container'>
                <img src={Logo} alt='Logo' onClick={() => history.push('/')} />
                <div className='header-p-container'>
                    <p>Login</p>
                    <p>|</p>
                    <p>Signup</p>
                </div>
            </div>
            <div className='header-strap'>
                <p>Meet new friends</p>
                <p>Battle your enemies</p>
            </div>
        </>
    );
}
