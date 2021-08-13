import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { auth } from '../Config/firebase';
import firebase from 'firebase';

export default function LoginPage() {

    const [err, setErr] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [avatar, setAvatar] = useState('');

    const history = useHistory();

    const signUpWithEmailAndPassword = () => {
        if (username.length > 0 && email.length && password.length > 0 && confirmPassword.length > 0 && avatar.length > 0) {
            if (password === confirmPassword) {
                auth.createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        const user = firebase.auth().currentUser;
                        return user?.updateProfile({
                            displayName: username,
                            photoURL: avatar
                        });
                    })
                    .then(() => {
                        history.push('/login');
                    })
                    .catch(
                        error => {
                            setErr(error.message);
                        }
                    );
            }
            else {
                setErr('Passwords do not match');
            }
        }
    };


    const handleClick = () => {
        history.push('/login');
    };

    const updateFields = (e: React.ChangeEvent<HTMLInputElement>, field: React.Dispatch<React.SetStateAction<string>>) => {
        field(e.target.value);
    };

    return (
        <div>
            <Form onSubmit={signUpWithEmailAndPassword}>
                <Form.Field>
                    <label>
                        Username
                    </label>
                    <input placeholder='Enter Username' onChange={(e) => updateFields(e, setUsername)} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Email Address
                    </label>
                    <input placeholder='Enter Email Address' onChange={(e) => updateFields(e, setEmail)} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Password
                    </label>
                    <input placeholder='Enter Password' onChange={(e) => updateFields(e, setPassword)} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Confirm Password
                    </label>
                    <input placeholder='Enter Password' onChange={(e) => updateFields(e, setConfirmPassword)} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Select Avatar
                    </label>
                    <div className='single-avatar-container'>
                        <img src='https://react.semantic-ui.com/images/avatar/small/lena.png' alt='avatar1' tabIndex={0} onClick={() => { setAvatar('https://react.semantic-ui.com/images/avatar/small/lena.png'); }} />
                        <img src='https://react.semantic-ui.com/images/avatar/small/matthew.png' alt='avatar2' tabIndex={1} onClick={() => { setAvatar('https://react.semantic-ui.com/images/avatar/small/matthew.png'); }} />
                        <img src='https://react.semantic-ui.com/images/avatar/small/lindsay.png' alt='avatar3' tabIndex={2} onClick={() => { setAvatar('https://react.semantic-ui.com/images/avatar/small/lindsay.png'); }} />
                        <img src='https://react.semantic-ui.com/images/avatar/small/mark.png' alt='avatar4' tabIndex={3} onClick={() => { setAvatar('https://react.semantic-ui.com/images/avatar/small/mark.png'); }} />
                    </div>
                </Form.Field>
                {err ? <p>{err}</p> : null}
                <Button type='submit'>Submit</Button>
            </Form>
            <p onClick={handleClick}>Login</p>
        </div>
    );
}
