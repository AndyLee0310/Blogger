import React from 'react';
import { List } from 'semantic-ui-react';
import { Link, useLocation } from 'react-router-dom';

function MemberMenu() {
    const location = useLocation();
    const menuItems  = [{
            name: 'My Posts',
            path: '/member/myPosts'
        }, {
            name: 'My Collections',
            path: '/member/collections'
        }, {
            name: 'My Settings',
            path: '/member/settings'
        },
    ];

    return (
        <List animated selection>
            {menuItems.map((menuItem) => {
                return (
                    <List.Item
                        key={menuItem.name}
                        as={Link}
                        to={menuItem.path}
                        active={menuItem.path === location.pathname}
                    >
                        {menuItem.name}
                    </List.Item>
                )
            })}
        </List>
    );
}

export default MemberMenu;