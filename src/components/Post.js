import { Item, Image, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

import defaultImage from '../assets/images/defaultImage.png';

function Post({ post }) {
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
}

export default Post;