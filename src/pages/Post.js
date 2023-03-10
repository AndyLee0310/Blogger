import React from 'react';
import { Container, Grid, Icon, Image, Header, Segment, Comment, Form, Button } from 'semantic-ui-react';
import { useParams } from 'react-router-dom';
import { database, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

import userImage from '../assets/images/userImage.jpg';

function Post() {
    const { postId } = useParams();
    const [post, setPost] = React.useState({author: {}, });
    const [commentContent, setCommentContent] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [comments, setComments] = React.useState([]);
    const [userCollections, setUserCollections] = React.useState([]);

    React.useEffect(() => {
        const recentPostRef = ref(database);
        get(child(recentPostRef, `posts/${postId}`)).then((snapshot) => {
            setPost(snapshot.val());
        })
    }, [postId]);

    React.useEffect(() => {
        const recentPostsRef = query(ref(database, `posts/${postId}/comments`));
        onValue(recentPostsRef, (collectionSnapshot) => {
            let commentsList = [];
            collectionSnapshot.forEach((childSnapshot) => {
                commentsList.push(childSnapshot.val());
            });
            setComments(commentsList.reverse());
        })
    }, [postId]);

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            const recentPostsRef = query(ref(database, `users/${currentUser.uid}/collections`));
            onValue(recentPostsRef, (collectionSnapshot) => {
                let collectionList = [];
                collectionSnapshot.forEach((childSnapshot) => {
                    collectionList.push(childSnapshot.val());
                });
                setUserCollections(collectionList);
            })
        });
    }, []);

    const isCollected = post.collectedBy?.includes(auth.currentUser.uid);
    const isLiked = post.likedBy?.includes(auth.currentUser.uid);

    function toggleCollected() {
        const uid = auth.currentUser.uid;
        const cntsCount = post.commentsCount || 0;
        const commentsList = post.comments || null;
        const collectedList = post.collectedBy || [];
        const collectedListByUser = userCollections || [];
        const updates = {};
        const updatesByUser = {};
        if (isCollected) {
            // remove uid from collectedList
            const tempList = collectedList.filter((e) => e !== uid);
            let obj = {
                commentsCount: cntsCount,
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
                comments: commentsList,
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);

            const tempListByUser = collectedListByUser.filter((e) => e !== postId);
            updatesByUser['/users/' + uid + '/collections'] = tempListByUser;
            update(ref(database), updatesByUser);
        } else {
            collectedList.push(uid);
            let obj = {
                commentsCount: cntsCount,
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
                comments: commentsList,
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);

            collectedListByUser.push(postId);
            updatesByUser['/users/' + uid + '/collections'] = collectedListByUser;
            update(ref(database), updatesByUser);
        }
        window.location.reload();
    }

    function toggleLiked() {
        const uid = auth.currentUser.uid;
        const cntsCount = post.commentsCount || 0;
        const commentsList = post.comments || null;
        const likedList = post.likedBy || [];
        const updates = {};
        if (isLiked) {
            // remove uid from likedList
            const tempList = likedList.filter((e) => e !== uid);
            let obj = {
                commentsCount: cntsCount,
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
                comments: commentsList,
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);
        } else {
            likedList.push(uid);
            let obj = {
                commentsCount: cntsCount,
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
                comments: commentsList,
            };
            updates['/posts/' + postId] = obj;
            update(ref(database), updates);
        }
        window.location.reload();
    }

    function handleSubmit() {
        const date = new Date();
        const newDateTime = date.toLocaleString("zh-TW", {hour12: false});

        const cntsCount = post.commentsCount || 0;
        const commentsList = post.comments || null;
        const updates = {};
        let obj = {
            commentsCount: cntsCount + 1,
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
            likedBy: post.likedBy || [],
            comments: commentsList,
        };
        updates['/posts/' + postId] = obj;
        update(ref(database), updates);

        const newCommentsKey = push(child(ref(database), 'comments')).key;
        const updateComment = {};
        let commentObj = {
            content: commentContent,
            createdAt: newDateTime,
            author: {
                uid: auth.currentUser.uid,
                displayName: auth.currentUser.displayName || '',
                photoURL: auth.currentUser.photoURL || '',
            }
        };
        updateComment['/posts/' + postId + '/comments/' + newCommentsKey] = commentObj;
        update(ref(database), updateComment).then(() => {
            setCommentContent('');
            setIsLoading(false);
            window.location.reload();
        });
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
                        <Image src={post.imageUrl} />
                        <Segment basic vertical>{post.content}</Segment>
                        <Segment basic vertical>
                            {post.commentsCount || 0} Comments&nbsp;&nbsp;??&nbsp;&nbsp;
                            {post.likedBy?.length || 0} Likes&nbsp;&nbsp;??&nbsp;&nbsp;
                            <Icon
                                name={`thumbs up ${isLiked ? "" : "outline"}`}
                                color={isLiked ? "blue" : "grey"}
                                link
                                onClick={toggleLiked} />&nbsp;&nbsp;??&nbsp;&nbsp;
                            <Icon
                                name={`bookmark ${isCollected ? "" : "outline"}`}
                                color={isCollected ? "blue" : "grey"}
                                link 
                                onClick={toggleCollected} />
                        </Segment>
                        <Comment.Group>
                            <Form>
                                <Form.TextArea 
                                    value={commentContent} 
                                    onChange={(e) => {
                                        setCommentContent(e.target.value);
                                    }} />
                                <Form.Button
                                    onClick={handleSubmit}
                                    loading={isLoading}>Comment</Form.Button>
                            </Form>
                            <Header>??? {post.commentsCount || 0} ?????????</Header>
                            {comments.map((comment) => {
                                return (
                                    <Comment key={comment.key}>
                                        <Comment.Avatar src={comment.author.photoURL || userImage} />
                                        <Comment.Content>
                                            <Comment.Author as="span">{comment.author.displayName || 'User' }</Comment.Author>
                                            <Comment.Metadata>{comment.createdAt}</Comment.Metadata>
                                            <Comment.Text>{comment.content}</Comment.Text>
                                        </Comment.Content>
                                    </Comment>
                                )
                            })}
                        </Comment.Group>
                    </Grid.Column>
                    <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default Post;