import { Routes, Route, Outlet } from 'react-router-dom';
import { Grid, Container } from 'semantic-ui-react';

import Header from './Header';
import Footer from './Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import NewPost from './pages/NewPost';
import Member from './pages/Member';
import Post from './pages/Post';
import MemberMenu from './components/MemberMenu';
import MemberPosts from './pages/member/Posts';
import MemberCollections from './pages/member/Collections';
import MemberSettings from './pages/member/Settings';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/new-post" element={<NewPost />} />
                <Route path="/member/myPosts" element={<MemberPosts />} />
                <Route path="/member/collections" element={<MemberCollections />} />
                <Route path="/member/settings" element={<MemberSettings />} />
                <Route path="/posts/:postId" element={<Post />} />
                <Route path="/admin/managementUsers" element={<p>managementUsers</p>} />
            </Route>
        </Routes>
    );
}

function Layout() {
    return (
        <div>
            <Header />
            <Outlet />
            <Footer />
        </div>
    );
}

export default App;