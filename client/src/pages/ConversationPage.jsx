import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMessagesWithUserApi, sendMessageApi } from '../api/messageApi';
import { useSelector } from 'react-redux';
import { getSocket } from '../socket';

const ConversationPage = () => {
    const { userId } = useParams(); // Partner ID
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const { user } = useSelector(state => state.auth);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await getMessagesWithUserApi(userId);
                setMessages(res.data);
                scrollToBottom();
            } catch (err) {
                console.error(err);
            }
        };
        fetchMessages();

        const socket = getSocket();
        if (socket) {
            socket.on('new_message', (msg) => {
                if (msg.sender._id === userId || msg.receiver._id === userId) {
                    setMessages(prev => [...prev, msg]);
                    scrollToBottom();
                }
            });
        }

        return () => {
            if (socket) socket.off('new_message');
        };
    }, [userId]);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        try {
            const res = await sendMessageApi(userId, text);
            setMessages(prev => [...prev, res.data]);
            setText('');
            scrollToBottom();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> <Link to="/messages">Inbox</Link> <span className="separator">»</span> Conversation
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">Private Conversation</div>
                <div className="forum-panel-body" style={{ background: 'var(--forum-white)', height: '400px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {messages.map(msg => {
                        const isMe = msg.sender._id === (user?._id || user?.id);
                        return (
                            <div key={msg._id} style={{ 
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                background: isMe ? 'var(--forum-row-odd)' : 'var(--forum-row-even)',
                                border: '1px solid var(--forum-border)',
                                padding: 'var(--forum-gap-sm)',
                                maxWidth: '70%'
                            }}>
                                <div style={{ fontSize: 'var(--forum-font-size-sm)', fontWeight: 'bold', marginBottom: '4px', color: 'var(--forum-header-dark)' }}>
                                    {msg.sender.username} <span className="text-muted" style={{ fontWeight: 'normal' }}>[{new Date(msg.createdAt).toLocaleTimeString()}]</span>
                                </div>
                                <div>{msg.content}</div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>
                
                <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)', borderTop: '1px solid var(--forum-border-light)' }}>
                    <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                        <input 
                            type="text" 
                            className="forum-input" 
                            style={{ flexGrow: 1 }} 
                            value={text} 
                            onChange={(e) => setText(e.target.value)} 
                            placeholder="Type a message..."
                        />
                        <button type="submit" className="forum-btn forum-btn-primary">Send</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ConversationPage;
