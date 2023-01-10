import React from 'react';
import { Grid, Container, Item, Header, Button, Segment, Modal, Input } from 'semantic-ui-react';
import { database, auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

import MemberMenu from '../../components/MemberMenu';

function MyName() {
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [displayName, setDisplayName] = React.useState('');

    function handleSubmit() {
        setIsModalOpen(false);
        // setIsLoading(true);
        // const userRef = ref(database, `users/${user.uid}`);
        // update(userRef, {
        //     displayName: displayName
        // });
        // setIsModalOpen(false);
        // user.updateProfile({displayName,})
        //     .then(() => {
        //         setIsLoading(false);
        //         setDisplayName('');
        //         setIsModalOpen(false);
        //     })
    }

    return (
        <>
        <Header size="small">
            User Name
            <Button
                floated="right"
                onClick={() => {
                    setIsModalOpen(true);
                }}>Edit</Button>
        </Header>
        <Segment vertical>{/* user.displayname */}</Segment>
        <Modal open={isModalOpen} size="mini">
            <Modal.Header>Edit User Name</Modal.Header>
            <Modal.Content>
                <Input
                    placeholder="Please input your new username."
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    fluid />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} loading={isLoading}>Edit</Button>
            </Modal.Actions>
        </Modal>
        </>
    );
}

function MyPhoto() {
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [displayName, setDisplayName] = React.useState('');

    function handleSubmit() {
        setIsModalOpen(false);
        // setIsLoading(true);
        // const userRef = ref(database, `users/${user.uid}`);
        // update(userRef, {
        //     displayName: displayName
        // });
        // setIsModalOpen(false);
        // user.updateProfile({displayName,})
        //     .then(() => {
        //         setIsLoading(false);
        //         setDisplayName('');
        //         setIsModalOpen(false);
        //     })
    }

    return (
        <>
        <Header size="small">
            Photo
            <Button floated="right" onClick={() => setIsModalOpen(true)}>Edit</Button>
        </Header>
        <Segment vertical>{/* user.photoURL */}</Segment>
        <Modal open={isModalOpen} size="mini">
            <Modal.Header>Edit User Photo</Modal.Header>
            <Modal.Content>
                Photo
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} loading={isLoading}>Edit</Button>
            </Modal.Actions>
        </Modal>
        </>
    );
}

function MyPassword() {
    const user = auth.currentUser;
    const [isLoading, setIsLoading] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [oldPassword, setOldPassword] = React.useState('');
    const [newPassword, setNewPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    function handleSubmit() {
        setIsModalOpen(false);
        // setIsLoading(true);
        // const userRef = ref(database, `users/${user.uid}`);
        // update(userRef, {
        //     displayName: displayName
        // });
        // setIsModalOpen(false);
        // user.updateProfile({displayName,})
        //     .then(() => {
        //         setIsLoading(false);
        //         setDisplayName('');
        //         setIsModalOpen(false);
        //     })
    }

    return (
        <>
        <Header size="small">
            Password
            <Button floated="right" onClick={() => setIsModalOpen(true)}>Edit</Button>
        </Header>
        <Segment vertical>********</Segment>
        <Modal open={isModalOpen} size="mini">
            <Modal.Header>Edit User Password</Modal.Header>
            <Modal.Content>
                <Header as="h4">Old Password</Header>
                <Input
                    placeholder="Please input old password."
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    type="password" />
                <Header as="h4">New Password</Header>
                <Input
                    placeholder="Please input new password."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    type="password" />
                <Header as="h4">Confirm New Password</Header>
                <Input
                    placeholder="Please input confirm new password."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    type="password" />
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleSubmit} loading={isLoading}>Edit</Button>
            </Modal.Actions>
        </Modal>
        </>
    );
}

function Collections() {

    React.useEffect(() => {
        // onAuthStateChanged(auth, (currentUser) => {
        //     const recentCollectionsRef = query(ref(database, `users/${currentUser.uid}/collections`));
        //     onValue(recentCollectionsRef, (collectionSnapshot) => {
        //         let collectionList = [];
        //         collectionSnapshot.forEach((childSnapshot) => {
        //             collectionList.push(childSnapshot.val());
        //         });
                
        //         const recentPostsRef = query(ref(database, "posts"));
        //         onValue(recentPostsRef, (colnSnapshot) => {
        //             let postList = [];
        //             colnSnapshot.forEach((childSnapshot) => {
        //                 collectionList.forEach((cSnapshot) => {
        //                     if (childSnapshot.key === cSnapshot) {
        //                         postList.push(childSnapshot);
        //                     }
        //                 })
        //             });
        //             setPosts(postList);
        //         });
        //     });
        // });
    }, []);

    const user = auth.currentUser;

    return (
        <Container textAlign='center'>
            <Header as="h2">My Settings</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}><MemberMenu /></Grid.Column>
                    <Grid.Column width={10} textAlign='left'>
                        <Item.Group>
                            <MyName />
                            <MyPhoto />
                            <MyPassword />
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default Collections;