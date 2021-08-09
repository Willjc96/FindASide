import React from 'react';
import Logo from '../Assets/FindASideLogo.png';
import './app.scss';

export default function Header() {
    return (
        <>
            <div className='header-container'>
                <img src={Logo} alt='Logo' />
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
