import React from 'react';
import { Grid, Container, Item, Header, Table, Icon, Button } from 'semantic-ui-react';
import { database, auth } from '../../firebase';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { ref, push, child, update, query, onValue, get } from 'firebase/database';

function ManagementUsers() {
    const [user, setUser] = React.useState(null);
    const [userList, setUserList] = React.useState([]);

    // onAuthStateChanged(auth, (currentUser) => {
    //     if (user)
    //         setUser(currentUser);
    //     else
    //         window.location.href = '/SignIn';
    // });

    React.useEffect(() => {
        const recentCollectionsRef = query(ref(database, 'users'));
        onValue(recentCollectionsRef, (usersSnapshot) => {
            let uList = [];
            usersSnapshot.forEach((childSnapshot) => {
                uList.push(childSnapshot.val());
            });
            setUserList(uList);
        });
    }, []);

    return (
        <Container textAlign='center'>
            <Header as="h2">Management Users</Header>
            <Grid>
                <Grid.Row>
                    <Grid.Column width={3}></Grid.Column>
                    <Grid.Column width={10} textAlign='left'>
                        <Item.Group>
                            <Table striped>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell textAlign='center'>User Name</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>Email</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>isAdmin</Table.HeaderCell>
                                        <Table.HeaderCell textAlign='center'>operate</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {userList.map(user => (
                                        <Table.Row>
                                            <Table.Cell textAlign='center'>{user.displayName}</Table.Cell>
                                            <Table.Cell textAlign='center'>{user.email}</Table.Cell>
                                            <Table.Cell textAlign='center'>{
                                                user.isAdmin ? <Icon name='check' /> : <></>
                                            }</Table.Cell>
                                            <Table.Cell textAlign='center'>
                                                <Button color='red' disabled>Delete</Button>
                                                <Button disabled>Reset Password</Button>
                                            </Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table>
                        </Item.Group>
                    </Grid.Column>
                    <Grid.Column width={3}></Grid.Column>
                </Grid.Row>
            </Grid>
        </Container>
    );
}

export default ManagementUsers;