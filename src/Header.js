import React from 'react';
import { Menu, Search, Image, Header as MenuHeader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { auth, database } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

import webSiteLogo from './assets/images/logo.png';

function Header() {
    const [user, setUser] = React.useState(null);
    const [userData, setUserData] = React.useState({});

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            const recentPostRef = ref(database);
            get(child(recentPostRef, `users/${currentUser.uid}`)).then((snapshot) => {
                setUserData(snapshot.val());
            })
        });
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
                    <Menu.Item>Welcome, {userData.displayName || "user"} !</Menu.Item>
                    {userData.isAdmin ? (
                        <Menu.Item as={Link} to="/admin/managementUsers">Member management</Menu.Item>
                    ) : (
                        <></>
                    )}
                    <Menu.Item as={Link} to="/new-post">New Post</Menu.Item>
                    <Menu.Item as={Link} to="/member/myPosts">Member</Menu.Item>
                    <Menu.Item onClick={() => {
                        signOut(auth).then(() => {
                            window.location.href = '/';
                        });
                        }}
                    >
                        Sign Out
                    </Menu.Item>
                    </>
                ) : (
                    <Menu.Item as={Link} to="/SignIn">Sign In / Sign Up</Menu.Item>
                )}
            </Menu.Menu>
        </Menu>
    );
}

export default Header;