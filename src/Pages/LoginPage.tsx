import React, { useState, useContext } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { auth } from '../Config/firebase';
import { UserContext } from '../Context/UserContext';

export default function LoginPage() {
    const userContext = useContext(UserContext);
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');

    const history = useHistory();

    const signInWithEmailAndPassword = (e: React.FormEvent) => {
        if (error !== '') {
            setError('');
        }
        auth.signInWithEmailAndPassword(email, password)
            .then(result => {
                console.log(result, 'res');
                userContext?.dispatch({
                    type: 'LOG_IN'
                });
                history.push('/');
            })
            .catch(error => {
                setError(error.message);
            });
    };

    const handleClick = () => {
        history.push('/signup');
    };

    const updateFields = (e: React.ChangeEvent<HTMLInputElement>, field: React.Dispatch<React.SetStateAction<string>>) => {
        field(e.target.value);
    };

    return (
        <div>
            <Form onSubmit={signInWithEmailAndPassword}>
                <Form.Field>
                    <label>
                        email
                    </label>
                    <input onChange={(e) => updateFields(e, setEmail)} placeholder='Enter Email' />
                </Form.Field>
                <Form.Field>
                    <label>
                        Password
                    </label>
                    <input onChange={(e) => updateFields(e, setPassword)} placeholder='Enter Password' />
                </Form.Field>
                {error ? <p>{error}</p> : null}
                <Button type='submit'>Submit</Button>
            </Form>
            <p onClick={handleClick}>Signup</p>
        </div>
    );
}
