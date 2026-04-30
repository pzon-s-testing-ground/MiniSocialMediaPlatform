import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './features/authSlice';
import Navbar from './components/Navbar';
import ForumHeader from './components/ForumHeader';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FeedPage from './pages/FeedPage';
import ThreadPage from './pages/ThreadPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';

import './App.css';

function App() {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            dispatch(getMe());
        }
    }, [token, dispatch]);

    return (
        <Router>
            <div className="app-container">
                <ForumHeader />
                <Navbar />
                <div style={{ flex: 1, padding: 'var(--forum-gap-lg) 0' }}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/" element={<ProtectedRoute><FeedPage /></ProtectedRoute>} />
                        <Route path="/thread/:id" element={<ProtectedRoute><ThreadPage /></ProtectedRoute>} />
                        <Route path="/profile/:id" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
