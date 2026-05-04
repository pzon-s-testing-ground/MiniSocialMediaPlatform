import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMe } from './features/authSlice';
import { initSocket, disconnectSocket, getSocket } from './socket';
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
import InboxPage from './pages/InboxPage';
import ConversationPage from './pages/ConversationPage';
import AdminPage from './pages/AdminPage';
import SearchPage from './pages/SearchPage';
import SupportPage from './pages/SupportPage';

import './App.css';

function App() {
    const dispatch = useDispatch();
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && !user) {
            dispatch(getMe());
        }
    }, [token, user, dispatch]);

    useEffect(() => {
        if (user) {
            initSocket(user._id || user.id);
            const socket = getSocket();
            socket.on('new_notification', (notif) => {
                alert(`New notification from ${notif.sender.username}!`);
            });
            socket.on('system_announcement', (data) => {
                alert(`📢 System Announcement from ${data.sender}:\n\n${data.message}`);
            });
            return () => {
                socket.off('new_notification');
                socket.off('system_announcement');
            }
        } else {
            disconnectSocket();
        }
    }, [user]);

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
                        <Route path="/messages" element={<ProtectedRoute><InboxPage /></ProtectedRoute>} />
                        <Route path="/messages/:userId" element={<ProtectedRoute><ConversationPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
                        <Route path="/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
                        <Route path="/support" element={<ProtectedRoute><SupportPage /></ProtectedRoute>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
