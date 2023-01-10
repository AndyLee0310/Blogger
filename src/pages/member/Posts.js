import React from 'react';
import { Grid, Container, Item, Header } from 'semantic-ui-react';
import { database, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

import Post from '../../components/Post';
import MemberMenu from '../../components/MemberMenu';

function Posts() {
    const [user, setUser] = React.useState(null);
    const [posts, setPosts] = React.useState([]);

    // onAuthStateChanged(auth, (currentUser) => {
    //     if (user)
    //         setUser(currentUser);
    //     else
    //         window.location.href = '/SignIn';
    // });


    React.useEffect(() => {
        const recentPostsRef = query(ref(database, 'posts'));
        // recentPostsRef.orderByChild('author.uid').equalTo(auth.currentUser.uid).on('value', (snapshot) => {
        //     console.log(snapshot.val());
        // })
        onValue(recentPostsRef, (collectionSnapshot) => {
            let postList = [];
            collectionSnapshot.forEach((childSnapshot) => {
                if (childSnapshot.val().author.uid === auth.currentUser.uid)
                    postList.push(childSnapshot);
            });
            setPosts(postList);
        })
    }, []);

    return (
        <Container textAlign='center'>
            <Header as="h2">My Posts</Header>
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

export default Posts;