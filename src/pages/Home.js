import React from 'react';
import { Header, Container } from 'semantic-ui-react';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Posts from './Posts';

function Home() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    }, []);
    return (
        <Container textAlign='center'>
            {user ? (
                // <Header as='h1'>Home</Header>
                <Posts />
            ) : (
                <>
                    <Header as='h1'>Welcome to the Blogger.</Header>
                </>
            )}
        </Container>
    );
}

export default Home;