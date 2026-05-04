import { useState, useEffect } from 'react';
import { createTicketApi, getMyTicketsApi } from '../api/actionApi';

const SupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchMyTickets();
    }, []);

    const fetchMyTickets = async () => {
        try {
            const res = await getMyTicketsApi();
            setTickets(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim()) return;
        setSubmitting(true);
        try {
            await createTicketApi({ subject, message });
            setSubject('');
            setMessage('');
            fetchMyTickets();
            alert('Ticket submitted successfully!');
        } catch (err) {
            alert('Error submitting ticket.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <a href="/">Forum Home</a> <span className="separator">»</span> Support & Help
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">:: Submit a Support Ticket ::</div>
                <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Subject:</label>
                            <input 
                                className="forum-input" 
                                type="text" 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                placeholder="e.g., Account issue, Bug report..."
                                required 
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message:</label>
                            <textarea 
                                className="forum-textarea" 
                                style={{ height: '100px' }} 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                placeholder="Describe your issue in detail..."
                                required 
                            />
                        </div>
                        <div className="text-right">
                            <button type="submit" className="forum-btn forum-btn-primary" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit Ticket'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="forum-panel" style={{ marginTop: 'var(--forum-gap-lg)' }}>
                <div className="forum-panel-header">:: My Support Tickets ::</div>
                <div className="forum-panel-body" style={{ background: 'var(--forum-white)' }}>
                    {loading ? (
                        <p>Loading your tickets...</p>
                    ) : tickets.length === 0 ? (
                        <p style={{ fontStyle: 'italic', color: 'gray' }}>You haven't submitted any tickets yet.</p>
                    ) : (
                        tickets.map(t => (
                            <div key={t._id} style={{ border: '1px solid var(--forum-border-light)', marginBottom: '10px', background: 'var(--forum-row-even)' }}>
                                <div style={{ background: 'var(--forum-header-dark)', color: '#fff', padding: '5px 10px', fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span><strong>{t.subject}</strong></span>
                                    <span>Status: <span style={{ color: t.status === 'Open' ? '#ffff00' : '#ccc' }}>[{t.status}]</span></span>
                                </div>
                                <div style={{ padding: '10px' }}>
                                    <div style={{ fontSize: '11px', color: 'gray', marginBottom: '5px' }}>Submitted on {new Date(t.createdAt).toLocaleString()}</div>
                                    <p style={{ fontSize: '13px', whiteSpace: 'pre-wrap' }}>{t.message}</p>
                                    
                                    {t.replies && t.replies.length > 0 && (
                                        <div style={{ marginTop: '10px', borderTop: '1px dashed var(--forum-border)' }}>
                                            <h5 style={{ margin: '8px 0', fontSize: '11px', color: 'var(--forum-header-dark)' }}>Replies:</h5>
                                            {t.replies.map((r, i) => (
                                                <div key={i} style={{ padding: '8px', background: '#fff', border: '1px solid #eee', marginBottom: '5px', fontSize: '12px' }}>
                                                    <strong>{r.sender?.username}</strong> <span style={{ fontSize: '10px', color: 'gray' }}>({new Date(r.createdAt).toLocaleString()}):</span>
                                                    <p style={{ marginTop: '3px' }}>{r.message}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
