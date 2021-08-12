import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useHistory } from 'react-router';
import { useState } from 'react';

interface User {
    username: string;
    emailAddress: string;
    password: string;
    confirmPassword: string;
}


export default function LoginPage() {

    const [user, setUser] = useState<{} | User>({});

    const history = useHistory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleClick = () => {
        history.push('/login');
    };

    const updateFields = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        setUser({
            ...user,
            [field]: e.target.value
        });
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>
                        Username
                    </label>
                    <input placeholder='Enter Username' onChange={(e) => updateFields(e, 'username')} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Email Address
                    </label>
                    <input placeholder='Enter Email Address' onChange={(e) => updateFields(e, 'emailAddress')} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Password
                    </label>
                    <input placeholder='Enter Password' onChange={(e) => updateFields(e, 'password')} />
                </Form.Field>
                <Form.Field>
                    <label>
                        Confirm Password
                    </label>
                    <input placeholder='Enter Password' onChange={(e) => updateFields(e, 'confirmPassword')} />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
            <p onClick={handleClick}>Login</p>
        </div>
    );
}
