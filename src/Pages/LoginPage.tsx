import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { useHistory } from 'react-router';

export default function LoginPage() {

    const history = useHistory();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const handleClick = () => {
        history.push('/signup');
    };

    return (
        <div>
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>
                        Username
                    </label>
                    <input placeholder='Enter Username' />
                </Form.Field>
                <Form.Field>
                    <label>
                        Password
                    </label>
                    <input placeholder='Enter Password' />
                </Form.Field>
                <Button type='submit'>Submit</Button>
            </Form>
            <p onClick={handleClick}>Signup</p>
        </div>
    );
}
