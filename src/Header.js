import React from 'react';
import { Menu, Search, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

import webSiteLogo from './assets/images/logo.png';

function Header() {
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        })
    }, []);
    return (
        <Menu>
            <Menu.Item as={Link} to="/">
                <Image src={webSiteLogo} size='mini' />
                Blogger
            </Menu.Item>
            <Menu.Item><Search /></Menu.Item>
            <Menu.Menu position="right">
                {user ? (
                    <>
                    <Menu.Item as={Link} to="/new-post">New Post</Menu.Item>
                    <Menu.Item as={Link} to="/aboutMe">About Me</Menu.Item>
                    <Menu.Item onClick={() => {signOut(auth);}}>Sign Out</Menu.Item>
                    </>
                ) : (
                    <Menu.Item as={Link} to="/SignIn">Sign In / Sign Up</Menu.Item>
                )}
            </Menu.Menu>
        </Menu>
    );
}

export default Header;