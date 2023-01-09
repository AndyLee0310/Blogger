import React from 'react';
import { Grid, Container, Item, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { database } from '../firebase';
import { ref, push, child, update, query, onValue } from 'firebase/database';

import defaultImage from '../assets/images/defaultImage.png';

class Posts extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            post: null,
            posts: [],
        };
    }

    getPosts = () => {
        const recentPostsRef = query(ref(database, 'posts'));
        onValue(recentPostsRef, (collectionSnapshot) => {
            let postList = [];
            collectionSnapshot.forEach((childSnapshot) => {
                postList.push(childSnapshot);
            });
            this.setState({posts: postList});
        })
    }

    componentDidMount() {
        this.getPosts();
    }

    render() {
        let posts = this.state.posts;
        // const listPosts = tmp.map((pot) => <ListItem key={pot.key.toString()} post={pot.val().title} />)
        return (
        <Container textAlign='center'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}></Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <Item.Group>
                                {posts.map(post => {
                                    return (
                                        <Item key={post.key.toString()}  as={Link} to={`/posts/${post.key.toString()}`}>
                                            <Item.Image src={post.val().imageUrl || defaultImage} size="small" />
                                            <Item.Content>
                                                <Item.Meta>
                                                    {post.val().author.photoURL ? (
                                                        <Image src={require(post.val().author.photoURL)} />
                                                    ) : (
                                                        <Icon name="user circle" />
                                                    )}
                                                    &nbsp;
                                                    {post.val().author.displayName ? (post.val().author.displayName) : ('User')}
                                                </Item.Meta>
                                                <Item.Header>{post.val().title}</Item.Header>
                                                <Item.Description>{post.val().content}</Item.Description>
                                                <Item.Extra>{post.val().commentsCount || 0} Comments · {post.val().likedBy?.length || 0} Likes</Item.Extra>
                                            </Item.Content>
                                        </Item>
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
}

export default Posts;
