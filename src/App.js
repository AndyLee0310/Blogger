import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import NewPost from './pages/NewPost';
import AboutMe from './pages/AboutMe';
import Post from './pages/Post';
// import Posts from './pages/Posts';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/new-post" element={<NewPost />} />
                <Route path="/aboutMe" element={<AboutMe />} />
                <Route path="/posts/:postId" element={<Post />} />
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