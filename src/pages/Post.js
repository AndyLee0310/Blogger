import React from 'react';
import { Container, Grid, Item, Icon, Image, Header, Segment } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import { database, auth } from '../firebase';
import { onAuthStateChanged, currentUser } from "firebase/auth";
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

import defaultImage from '../assets/images/defaultImage.png';

function Post() {
    const history = useNavigate();
    const [user, setUser] = React.useState(null);
    const { postId } = useParams();
    const [post, setPost] = React.useState({author: {}, });
    // const [post, setPost] = React.useState({author: {
    //                                             displayName: "andy", 
    //                                             email: "t108590001@ntut.org.tw",
    //                                             photoURL: "",
    //                                             uid: "269m9NlQpbfXiXTucmqxV3ddZcN2"},
    //                                         content: "this is a test post",
    //                                         createdAt: "2023/1/6 13:32:07",
    //                                         imageUrl: "",
    //                                         title: "test123"});

    onAuthStateChanged(auth, (currentUser) => {
        // if (user)
        setUser(currentUser);
        // else
        // history('/signin');
    });

    React.useEffect(() => {
        const recentPostRef = ref(database);
        get(child(recentPostRef, `posts/${postId}`)).then((snapshot) => {
            setPost(snapshot.val());
        })
    }, []);

    const isCollected = post.collectedBy?.includes(auth.currentUser.uid);
    const isLiked = post.likedBy?.includes(auth.currentUser.uid);

    function toggleCollected() {
        const uid = auth.currentUser.uid;
        const collectedList = post.collectedBy || [];
        const updates = {};
        if (isCollected) {
            // remove uid from collectedList
            const tempList = collectedList.filter((e) => e !== uid);
            let obj = {
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt,
                author: {
                    displayName: post.author.displayName,
                    photoURL: post.author.photoURL,
                    uid: post.author.uid,
                    email: post.author.email
                },
                collectedBy: tempList,
                likedBy: post.likedBy || [],
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);
        } else {
            collectedList.push(uid);
            let obj = {
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt,
                author: {
                    displayName: post.author.displayName,
                    photoURL: post.author.photoURL,
                    uid: post.author.uid,
                    email: post.author.email
                },
                collectedBy: collectedList,
                likedBy: post.likedBy || [],
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);
        }
        window.location.reload();
    }

    function toggleLiked() {
        const uid = auth.currentUser.uid;
        const likedList = post.likedBy || [];
        const updates = {};
        if (isLiked) {
            // remove uid from likedList
            const tempList = likedList.filter((e) => e !== uid);
            let obj = {
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt,
                author: {
                    displayName: post.author.displayName,
                    photoURL: post.author.photoURL,
                    uid: post.author.uid,
                    email: post.author.email
                },
                collectedBy: post.collectedBy || [],
                likedBy: tempList,
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);
        } else {
            likedList.push(uid);
            let obj = {
                title: post.title,
                content: post.content,
                imageUrl: post.imageUrl,
                createdAt: post.createdAt,
                author: {
                    displayName: post.author.displayName,
                    photoURL: post.author.photoURL,
                    uid: post.author.uid,
                    email: post.author.email
                },
                collectedBy: post.collectedBy || [],
                likedBy: likedList,
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);
        }
        window.location.reload();
    }

    return (
        <Container textAlign='center'>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}></Grid.Column>
                    <Grid.Column width={10} textAlign='left'>
                        {post.author.photoURL ? (
                                <Image src={require(post.author.photoURL)} />
                            ) : (
                                <Icon name="user circle" />
                            )}
                            &nbsp;
                            {post.author.displayName ? (post.author.displayName) : ('User')}
                        <Header>
                            {post.title}
                            <Header.Subheader>
                                Created at {post.createdAt}
                            </Header.Subheader>
                        </Header>
                        <Image src={post.imageUrl || defaultImage} />
                        <Segment basic vertical>{post.content}</Segment>
                        <Segment basic vertical>
                            0 Comments&nbsp;&nbsp;·&nbsp;&nbsp;
                            {post.likedBy?.length || 0} Likes&nbsp;&nbsp;·&nbsp;&nbsp;
                            <Icon
                                name={`thumbs up ${isLiked ? "" : "outline"}`}
                                color={isLiked ? "blue" : "grey"}
                                link
                                onClick={toggleLiked} />&nbsp;&nbsp;·&nbsp;&nbsp;
                            <Icon
                                name={`bookmark ${isCollected ? "" : "outline"}`}
                                color={isCollected ? "blue" : "grey"}
                                link 
                                onClick={toggleCollected} />
                        </Segment>
                    </Grid.Column>
                    <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default Post;