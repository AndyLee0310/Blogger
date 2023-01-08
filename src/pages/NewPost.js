import React from 'react';
import { Container, Header, Form, Image, Button } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { database, auth, storage } from '../firebase';
import { onAuthStateChanged } from "firebase/auth";
import { ref as databaseRef, push, child, update, query, onValue } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultImage from '../assets/images/defaultImage.png';

function NewPost() {
    const history = useNavigate();
    const [user, setUser] = React.useState(null);
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const previewUrl = file ? URL.createObjectURL(file) : defaultImage;

    React.useEffect(() => {
        onAuthStateChanged(auth, (currentUser) => {
            // if (user)
            setUser(currentUser);
            // else
            //     history('/signin');
        })
    }, []);

    const handleSubmit = () => {
        setIsLoading(true);

        let obj = {};

        // Create a unique key for new posts
        const newPostKey = push(child(databaseRef(database), 'posts')).key;
        const fileRef = storageRef(storage, 'post-images/' + newPostKey);
        const date = new Date();
        const newDateTime = date.toLocaleString("zh-TW", {hour12: false});

        if (file === null) {
            // If not upload image
            uploadBytes(fileRef, file).then(() => {
                obj = {
                    title,
                    content,
                    imageUrl: '',
                    createdAt: newDateTime,
                    author: {
                        displayName: auth.currentUser.displayName || '',
                        photoURL: auth.currentUser.photoURL || '',
                        uid: auth.currentUser.uid,
                        email: auth.currentUser.email
                    }
                }
                
                const updates = {};
                updates['/posts/' + newPostKey] = obj;
                update(databaseRef(database), updates)
                    .then(() => {
                        setIsLoading(true);
                        history('/');
                    });
            }).catch((err) => {alert("uploadBytes error: " + err.message)});
        } else {
            // If upload image
            const metadata = {
                contentType: file.type
            };
            uploadBytes(fileRef, file, metadata).then(() => {
                getDownloadURL(fileRef).then((imageUrl) => {
                    // console.log(imageUrl);
                    obj = {
                        title,
                        content,
                        imageUrl,
                        createdAt: newDateTime,
                        author: {
                            displayName: auth.currentUser.displayName || '',
                            photoURL: auth.currentUser.photoURL || '',
                            uid: auth.currentUser.uid,
                            email: auth.currentUser.email
                        }
                    }
                    
                    const updates = {};
                    updates['/posts/' + newPostKey] = obj;
                    update(databaseRef(database), updates)
                        .then(() => {
                            setIsLoading(true);
                            history('/');
                        });
                }).catch((err) => {alert("getDownloadUrl error: " + err.message)});
            }).catch((err) => {alert("uploadBytes error: " + err.message)});
            }
    }

    /*
    // JSON about write data to database
    {
        "title": "test",
        "content": "test123",
        "createdAt": database.Timestamp.now(),
        "author": {
            "displayName": "",
            "photoURL": "",
            "uid": "269m9NlQpbfXiXTucmqxV3ddZcN2",
            "email": "t108590001@ntut.org.tw"
        }
    }
    */

    return (
        <Container>
            <Header as='h1' textAlign='center'>New Post</Header>
            <Form onSubmit={handleSubmit}>
                <Image src={previewUrl} />
                <Button basic as='label' htmlFor='post-image' style={{ width: '100%' }}>Update Post Image</Button>
                <Form.Input 
                    id='post-image' 
                    type='file' 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                        setFile(e.target.files[0]);
                    }}/>
                <Form.Input
                    label='Post Title'
                    value={title}
                    onChange={(e) => {setTitle(e.target.value);}}
                    placeholder="Please input post title" />
                <Form.TextArea
                    label='Post Content'
                    value={content}
                    onChange={(e) => {setContent(e.target.value);}}
                    placeholder="Please input post content" />
                <Form.Button loading={isLoading}>Submit</Form.Button>
            </Form>
        </Container>
    );
}

export default NewPost;