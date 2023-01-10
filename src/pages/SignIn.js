import React from 'react';
import { Menu, Form, Container, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, push, child, update, query, onValue } from 'firebase/database';


function SignIn() {
    const history = useNavigate();
    const [activeItem, setActiveItem] = React.useState('signin');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = () => {
        setIsLoading(true);
        if (activeItem === 'signup') {
            if (password !== confirmPassword) {
                alert('Passwords do not match !');
            } else {
                createUserWithEmailAndPassword(auth, email, password)
                    .then(() => {
                        let obj = {
                            displayName: auth.currentUser.displayName || '',
                            photoURL: auth.currentUser.photoURL || '',
                            email: auth.currentUser.email,
                            isAdmin: false,
                            uid: auth.currentUser.uid
                        }
                        const updates = {};
                        updates['/users/' + auth.currentUser.uid] = obj;
                        update(ref(database), updates)
                            .then(() => {
                                setIsLoading(false);
                                history('/');
                                window.location.reload();
                            });
                        // history('/');
                        // setIsLoading(false);
                    })
                    .catch((err) => {
                        switch(err.code) {
                            case 'auth/email-already-in-use':
                                setErrorMessage('Email already in use');
                                break;
                            case 'auth/invalid-email':
                                setErrorMessage('Invalid email');
                                break;
                            case 'auth/weak-password':
                                setErrorMessage('Weak password (Length needs 6 digits)');
                                break;
                            default:
                        }
                        setIsLoading(false);
                    });
            }
        } else if (activeItem === 'signin') {
            signInWithEmailAndPassword(auth, email, password)
                .then(() => {
                    history('/');
                    setIsLoading(false);
                })
                .catch((err) => {
                    switch(err.code) {
                        case 'auth/user-not-found':
                            setErrorMessage('User not found');
                            break;
                        case 'auth/invalid-email':
                            setErrorMessage('Invalid email');
                            break;
                        case 'auth/wrong-password':
                            setErrorMessage('Wrong password');
                            break;
                        default:
                    }
                    setIsLoading(false);
                });
        }
    }

    return (
        <Container>
            <Menu widths="2">
                <Menu.Item
                    active={activeItem === 'signup'}
                    onClick={() => { 
                        setActiveItem('signup');
                        setErrorMessage('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    }}>
                        Sign Up
                </Menu.Item>
                <Menu.Item
                    active={activeItem === 'signin'}
                    onClick={() => {
                        setActiveItem('signin');
                        setErrorMessage('');
                        setEmail('');
                        setPassword('');
                        setConfirmPassword('');
                    }}>
                        Sign In
                </Menu.Item>
            </Menu>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    label="Email"
                    value={email}
                    onChange={(e) => {setEmail(e.target.value)}}
                    placeholder="Please input email"
                    />
                <Form.Input
                    label="Password"
                    value={password}
                    onChange={(e) => {setPassword(e.target.value)}}
                    placeholder="Please input password"
                    type="password"
                    />
                {
                    activeItem === 'signup' ? (
                        <Form.Input
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => {setConfirmPassword(e.target.value)}}
                            placeholder="Please input confirm password"
                            type="password"
                            />
                    ) : (<div></div>)
                }
                {errorMessage && <Message negative>{errorMessage}</Message>}
                <Form.Button loading={isLoading}>
                    {activeItem === 'signup' && 'Sign Up'}
                    {activeItem === 'signin' && 'Sign In'}
                </Form.Button>
            </Form>
        </Container>
    );
}

export default SignIn;