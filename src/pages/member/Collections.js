import React from 'react';
import { Grid, Container, Item, Header } from 'semantic-ui-react';
import { database, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

import Post from '../../components/Post';
import MemberMenu from '../../components/MemberMenu';

function Collections() {
    const [posts, setPosts] = React.useState([]);

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            const recentCollectionsRef = query(ref(database, `users/${currentUser.uid}/collections`));
            onValue(recentCollectionsRef, (collectionSnapshot) => {
                let collectionList = [];
                collectionSnapshot.forEach((childSnapshot) => {
                    collectionList.push(childSnapshot.val());
                });
                
                const recentPostsRef = query(ref(database, "posts"));
                onValue(recentPostsRef, (colnSnapshot) => {
                    let postList = [];
                    colnSnapshot.forEach((childSnapshot) => {
                        collectionList.forEach((cSnapshot) => {
                            if (childSnapshot.key === cSnapshot) {
                                postList.push(childSnapshot);
                            }
                        })
                    });
                    setPosts(postList);
                });
            });
        });
    }, []);

    return (
        <Container textAlign='center'>
            <Header as="h2">My Collections</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}><MemberMenu /></Grid.Column>
                    <Grid.Column width={10} textAlign='left'>
                        <Item.Group>
                            {posts.map(post => {
                                return (
                                    <Post post={post} />
                                );
                            })}
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default Collections;