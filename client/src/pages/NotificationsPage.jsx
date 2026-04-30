import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get('/notifications');
                setNotifications(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchNotifications();
    }, []);

    const markAllRead = async () => {
        try {
            await axios.put('/notifications/read');
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="forum-loading">Loading notifications...</div>;

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> User Control Panel <span className="separator">»</span> Private Messages & Notifications
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">
                    <span>Inbox</span>
                </div>
                
                <div style={{ padding: 'var(--forum-gap-sm) var(--forum-gap-lg)', background: 'var(--forum-row-even)', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="forum-btn forum-btn-sm" onClick={markAllRead}>Mark All Read</button>
                </div>

                <div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: 'var(--forum-gap-lg)', textAlign: 'center' }}>You have no new messages.</div>
                    ) : (
                        notifications.map(notif => (
                            <div key={notif._id} className={`forum-notification-row ${!notif.read ? 'unread' : ''}`}>
                                <div className="notif-icon">
                                    {!notif.read ? '📩' : '✉️'}
                                </div>
                                <div className="notif-content">
                                    <Link to={`/profile/${notif.sender._id}`}>{notif.sender.username}</Link>
                                    {' '}
                                    {notif.type === 'like' && 'liked your post.'}
                                    {notif.type === 'comment' && 'replied to your post.'}
                                    {notif.type === 'follow' && 'started following you.'}
                                    {' '}
                                    {notif.post && <Link to={`/thread/${notif.post}`}>View Thread</Link>}
                                </div>
                                <div className="notif-time">
                                    {new Date(notif.createdAt).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
