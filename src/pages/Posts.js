import React from 'react';
import { Grid, Container, Item, Image, Icon, Button, Label } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { database } from '../firebase';
import { ref, push, child, update, query, onValue } from 'firebase/database';
import InfiniteScroll from 'react-infinite-scroll-component';

import defaultImage from '../assets/images/defaultImage.png';
import Post from '../components/Post';

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
            postList.reverse();
            this.setState({posts: postList});
        })
    }

    componentDidMount() {
        this.getPosts();
    }

    fetchMoreData = () => {
        setTimeout(() => {
            this.setState({
                posts: this.state.posts.concat(this.state.posts)
            });
        }, 1500);
    }

    render() {
        let posts = this.state.posts;
        const paragraph = <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
        // const listPosts = tmp.map((pot) => <ListItem key={pot.key.toString()} post={pot.val().title} />)
        return (
        <Container textAlign='center'>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={3}></Grid.Column>
                        <Grid.Column width={10} textAlign='left'>
                            <Item.Group divided>
                                <InfiniteScroll
                                    dataLength={this.state.posts.length}
                                    next={this.fetchMoreData}
                                    hasMore={true}
                                    loader={<h4>Loading...</h4>} >
                                    {posts.map(post => (
                                    //     <>
                                    //     <Item style={{'border': '1px solid'}}>
                                    //     <Item.Image src='https://react.semantic-ui.com/images/wireframe/image.png' size="small" />
                                  
                                    //     <Item.Content>
                                    //       <Item.Header as='a'>My Neighbor Totoro</Item.Header>
                                    //       <Item.Meta>
                                    //         <span className='cinema'>IFC Cinema</span>
                                    //       </Item.Meta>
                                    //       <Item.Description>{paragraph}</Item.Description>
                                    //       <Item.Extra>
                                    //         <Button primary floated='right'>
                                    //           Buy tickets
                                    //           <Icon name='right chevron' />
                                    //         </Button>
                                    //       </Item.Extra>
                                    //     </Item.Content>
                                    //   </Item>
                                    //   <br />
                                    //   </>
                                        // return (
                                            // <Post post={post} />
                                            <>
                                            <Item key={post.key.toString()}>
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
                                                    <Item.Extra>
                                                        {post.val().commentsCount || 0} Comments · {post.val().likedBy?.length || 0} Likes
                                                        <Button floated='right' as={Link} to={`/posts/${post.key.toString()}`}>
                                                            more
                                                            <Icon name='right chevron' />
                                                        </Button>
                                                    </Item.Extra>
                                                </Item.Content>
                                            </Item>
                                            <br />
                                            <hr />
                                            <br />
                                            </>
                                        // );
                                    ))}
                                </InfiniteScroll>
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
