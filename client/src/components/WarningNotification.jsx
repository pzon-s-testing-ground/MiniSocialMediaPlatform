import { Link } from 'react-router-dom';

const WarningNotification = ({ notification }) => {
    return (
        <div className={`forum-notification-row ${!notification.read ? 'unread' : ''}`} style={{ borderLeft: '4px solid red', backgroundColor: !notification.read ? '#ffebeb' : 'var(--forum-row-odd)' }}>
            <div className="notif-icon">
                [/WARNING]
            </div>
            <div className="notif-content">
                <strong><span style={{ color: 'red' }}>ADMIN WARNING</span></strong> from <Link to={`/profile/${notification.sender._id}`}>{notification.sender.username}</Link>:
                <div style={{ marginTop: '5px', padding: '10px', backgroundColor: '#fff', border: '1px solid #ffcccc', color: '#333', fontStyle: 'italic' }}>
                    "{notification.message}"
                </div>
            </div>
            <div className="notif-time">
                {new Date(notification.createdAt).toLocaleString()}
            </div>
        </div>
    );
};

export default WarningNotification;
