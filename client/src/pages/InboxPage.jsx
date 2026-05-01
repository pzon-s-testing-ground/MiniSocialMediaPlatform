import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getConversationsApi } from '../api/messageApi';

const InboxPage = () => {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConvos = async () => {
            try {
                const res = await getConversationsApi();
                setConversations(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchConvos();
    }, []);

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Private Messages
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">Inbox</div>
                <div className="forum-panel-body">
                    {loading ? (
                        <div>Loading messages...</div>
                    ) : conversations.length === 0 ? (
                        <div>No messages yet.</div>
                    ) : (
                        <table className="forum-stats-table">
                            <tbody>
                                {conversations.map(conv => (
                                    <tr key={conv.partner._id}>
                                        <td style={{ width: '50px', textAlign: 'center' }}>
                                            <img 
                                                src={conv.partner.avatar ? (conv.partner.avatar.startsWith('http') ? conv.partner.avatar : `http://localhost:5000${conv.partner.avatar}`) : 'https://via.placeholder.com/40'} 
                                                alt="Avatar" 
                                                style={{ width: '40px', height: '40px', objectFit: 'cover', border: '1px solid var(--forum-border-dark)' }}
                                            />
                                        </td>
                                        <td>
                                            <Link to={`/messages/${conv.partner._id}`} style={{ fontWeight: 'bold', fontSize: 'var(--forum-font-size-md)' }}>
                                                {conv.partner.username}
                                            </Link>
                                            <div className="text-muted" style={{ fontSize: 'var(--forum-font-size-sm)' }}>
                                                {conv.lastMessage.content.substring(0, 50)}...
                                            </div>
                                        </td>
                                        <td className="text-right text-muted" style={{ width: '150px' }}>
                                            {new Date(conv.lastMessage.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InboxPage;
