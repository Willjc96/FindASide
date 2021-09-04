import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useState } from 'react';
import { auth } from '../Config/firebase';
import firebase from 'firebase';
import { images } from '../AvatarList';

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
                            console.log(error)
                            setErr(error.message);
                        }
                    );
            }
            else {
                setErr('Passwords Do Not Match');
            }
        }
        else {
            setErr('Please Fill All Fields And Pick A Avatar')
        }
    };


    const handleClick = () => {
        history.push('/login');
    };

    const updateFields = (e: React.ChangeEvent<HTMLInputElement>, field: React.Dispatch<React.SetStateAction<string>>) => {
        field(e.target.value);
    };

    return (
        <div className='full-page-container-signup'>
            <div style={{ textAlign: 'center', padding: '50px 0 50px 0' }}>
                <Form onSubmit={signUpWithEmailAndPassword}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Form.Field width={4}>
                            <label style={{ textAlign: 'left' }}>
                                USERNAME
                            </label>
                            <input placeholder='Enter Username' onChange={(e) => updateFields(e, setUsername)} />
                        </Form.Field>
                        <Form.Field width={4}>
                            <label style={{ textAlign: 'left' }}>
                                EMAIL ADDRESS
                            </label>
                            <input placeholder='Enter Email Address' onChange={(e) => updateFields(e, setEmail)} />
                        </Form.Field>
                        <Form.Field width={4}>
                            <label style={{ textAlign: 'left' }}>
                                PASSWORD
                            </label>
                            <input type='password' placeholder='Enter Password' onChange={(e) => updateFields(e, setPassword)} />
                        </Form.Field>
                        <Form.Field width={4}>
                            <label style={{ textAlign: 'left' }}>
                                CONFIRM PASSWORD
                            </label>
                            <input type='password' placeholder='Enter Password' onChange={(e) => updateFields(e, setConfirmPassword)} />
                        </Form.Field>
                    </div>
                    <Form.Field>
                        <label>
                            Select Avatar
                        </label>
                        <div className='select-avatar-container'>
                            {
                                images.map((image, i) => {
                                    return (
                                        <img src={image.url.toString()} style={{ maxHeight: '160px' }} alt={`avatar${i}`} tabIndex={i} onClick={() => { setAvatar(image.url.toString()); }} />
                                    );
                                })
                            }
                        </div>
                    </Form.Field>
                    {err && <h3 >{err}</h3>}
                    <Button type='submit'>Submit</Button>
                    <div style={{ paddingTop: '10px' }}>
                        <Button onClick={handleClick}>Login Page</Button>
                    </div>
                </Form>
            </div>
        </div>
    );
}