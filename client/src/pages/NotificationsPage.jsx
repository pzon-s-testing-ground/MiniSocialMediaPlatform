import { useEffect, useState } from 'react';
import { getNotificationsApi, markNotificationsReadApi } from '../api/notificationApi';
import { Link } from 'react-router-dom';
import WarningNotification from '../components/WarningNotification';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await getNotificationsApi();
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
            await markNotificationsReadApi();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="forum-loading">Loading notifications...</div>;

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> User Control Panel <span className="separator">»</span> Notifications
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">
                    <span>Notifications</span>
                </div>

                <div style={{ padding: 'var(--forum-gap-sm) var(--forum-gap-lg)', background: 'var(--forum-row-even)', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="forum-btn forum-btn-sm" onClick={markAllRead}>Mark All Read</button>
                </div>


                <div>
                    {notifications.length === 0 ? (
                        <div style={{ padding: 'var(--forum-gap-lg)', textAlign: 'center' }}>You have no new notifications.</div>
                    ) : (
                        notifications.map(notif => {
                            if (notif.type === 'warning') {
                                return <WarningNotification key={notif._id} notification={notif} />;
                            }

                            const typeLabel = {
                                like: '[LIKE]',
                                reply: '[REPLY]',
                                follow: '[FOLLOW]',
                            }[notif.type] || '[NOTIF]';

                            const typeColor = {
                                like: '#cc0000',
                                reply: '#006600',
                                follow: '#000099',
                            }[notif.type] || 'gray';

                            const actionText = {
                                like: 'liked your post.',
                                reply: 'replied to your thread.',
                                follow: 'started following you.',
                            }[notif.type];

                            const threadTitle = notif.post?.title || notif.post?.content?.substring(0, 30) || null;

                            return (
                                <div key={notif._id} style={{
                                    padding: '8px var(--forum-gap-lg)',
                                    borderBottom: '1px solid var(--forum-border-light)',
                                    background: !notif.read ? 'var(--forum-row-even)' : 'var(--forum-white)',
                                    display: 'flex', alignItems: 'flex-start', gap: '10px'
                                }}>
                                    <div style={{ fontFamily: 'monospace', fontWeight: 'bold', color: typeColor, whiteSpace: 'nowrap', minWidth: '70px', fontSize: '11px', paddingTop: '2px' }}>
                                        {!notif.read && '* '}{typeLabel}
                                    </div>
                                    <div style={{ flexGrow: 1, fontSize: '12px' }}>
                                        <Link to={`/profile/${notif.sender._id}`} style={{ fontWeight: 'bold' }}>{notif.sender.username}</Link>
                                        {' '}{actionText}
                                        {notif.post && (
                                            <>
                                                {' - '}
                                                <Link to={`/thread/${notif.post._id}`}>
                                                    {threadTitle ? `"${threadTitle}..."` : '[View Thread]'}
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '10px', color: 'gray', whiteSpace: 'nowrap' }}>
                                        {new Date(notif.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
