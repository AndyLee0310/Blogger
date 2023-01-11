import React from 'react';
import { Menu, Search, Image } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, database } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';
import { algolia } from './algolia';

import webSiteLogo from './assets/images/logo.png';

function Header() {
    const history = useNavigate();
    const [user, setUser] = React.useState(null);
    const [userData, setUserData] = React.useState({});
    const [inputValue, setInputValue] = React.useState('');
    const [results, setResults] = React.useState([]);

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);

            const recentPostRef = ref(database);
            get(child(recentPostRef, `users/${currentUser.uid}`)).then((snapshot) => {
                setUserData(snapshot.val());
            })
        });
    }, []);

    function onSearchChange(e, { value }) {
        setInputValue(value);

        algolia.search(value).then((result) => {
            // console.log(result.hits);
            const searchResults = result.hits.map((hit) => {
                return {
                    title: hit.title,
                    description: hit.content,
                    id: hit.objectID,
                };
            });
            setResults(searchResults);
        });
    }

    function onResultSelect(e, { result }) {
        setInputValue('');
        history(`/posts/${result.id}`);
    }

    return (
        <Menu>
            <Menu.Item as={Link} to="/">
                <Image src={webSiteLogo} size='mini' />
                Blogger
            </Menu.Item>
            {user ? (
                <Menu.Item>
                    <Search 
                        value={inputValue}
                        onSearchChange={onSearchChange}
                        results={results}
                        noResultsMessage="No related posts found"
                        onResultSelect={onResultSelect} />
                </Menu.Item>
                ) : (
                    <></>
                )
            }
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