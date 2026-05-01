import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    getUsersApi, banUserApi, warnUserApi, changeRoleApi, verifyUserApi, shadowbanUserApi,
    getReportsApi, resolveReportApi, getAuditLogsApi, getSettingsApi, updateSettingApi,
    getAnalyticsApi,
    sendAnnouncementApi, getTicketsApi, replyToTicketApi
} from '../api/adminApi';

const AdminPage = () => {
    const { user: currentUser } = useSelector(state => state.auth);
    const [activeTab, setActiveTab] = useState('users');

    // User Management state
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [warnModal, setWarnModal] = useState({ open: false, userId: null, reason: '' });
    const [banModal, setBanModal] = useState({ open: false, userId: null, reason: '', isBanned: false });

    // Moderation state
    const [reports, setReports] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    const [bannedWords, setBannedWords] = useState('');

    // Analytics state
    const [analytics, setAnalytics] = useState(null);

    // Communication state
    const [announcement, setAnnouncement] = useState('');
    const [tickets, setTickets] = useState([]);
    const [ticketReply, setTicketReply] = useState({});

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'moderation') { fetchReports(); fetchAuditLogs(); fetchSettings(); }
        if (activeTab === 'analytics') fetchAnalytics();
        if (activeTab === 'comms') fetchTickets();
    }, [activeTab]);

    const fetchUsers = async () => {
        try { const res = await getUsersApi(searchQuery); setUsers(res.data); } catch (e) { console.error(e); }
    };
    const fetchReports = async () => {
        try { const res = await getReportsApi(); setReports(res.data); } catch (e) { console.error(e); }
    };
    const fetchAuditLogs = async () => {
        try { const res = await getAuditLogsApi(); setAuditLogs(res.data); } catch (e) { console.error(e); }
    };
    const fetchSettings = async () => {
        try { const res = await getSettingsApi(); setBannedWords(res.data.banned_words || ''); } catch (e) { console.error(e); }
    };
    const fetchAnalytics = async () => {
        try { const res = await getAnalyticsApi(); setAnalytics(res.data); } catch (e) { console.error(e); }
    };
    const fetchTickets = async () => {
        try { const res = await getTicketsApi(); setTickets(res.data); } catch (e) { console.error(e); }
    };

    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Moderator') {
        return <div className="forum-alert forum-alert-error">Access Denied.</div>;
    }

    const tabs = [
        { id: 'users', label: '[Users] Management' },
        { id: 'moderation', label: '[Mod] Content Moderation' },
        { id: 'analytics', label: '[Stats] Analytics' },
        { id: 'comms', label: '[Comms] Communication' },
    ];

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Administration Dashboard
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '0' }}>
                {tabs.map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="forum-btn"
                        style={{
                            padding: '8px 16px', borderBottom: activeTab === t.id ? '3px solid var(--forum-header-dark)' : '3px solid transparent',
                            fontWeight: activeTab === t.id ? 'bold' : 'normal', background: activeTab === t.id ? 'var(--forum-header-dark)' : 'var(--forum-row-even)',
                            color: activeTab === t.id ? '#fff' : 'var(--forum-text)', cursor: 'pointer', fontSize: '12px'
                        }}>
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="forum-panel" style={{ borderTop: '3px solid var(--forum-header-dark)' }}>
                {/* ===== TAB: USER MANAGEMENT ===== */}
                {activeTab === 'users' && (
                    <>
                        <div className="forum-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>:: User Management ::</span>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <input className="forum-input" style={{ width: '200px', padding: '3px 8px' }} placeholder="Search by username or email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                                <button className="forum-btn forum-btn-sm" onClick={fetchUsers}>Search</button>
                            </div>
                        </div>
                        <div className="forum-panel-body" style={{ background: 'var(--forum-white)', overflowX: 'auto' }}>
                            <table className="forum-stats-table" style={{ width: '100%', fontSize: '11px' }}>
                                <thead>
                                    <tr style={{ background: 'var(--forum-row-even)', fontWeight: 'bold' }}>
                                        <th style={{ padding: '8px', textAlign: 'left' }}>User</th>
                                        <th style={{ padding: '8px', textAlign: 'center' }}>Role</th>
                                        <th style={{ padding: '8px', textAlign: 'center' }}>Status</th>
                                        <th style={{ padding: '8px', textAlign: 'center' }}>Warns</th>
                                        <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} style={{ borderBottom: '1px solid var(--forum-border-light)' }}>
                                            <td style={{ padding: '8px' }}>
                                                <Link to={`/profile/${u._id}`}><strong>{u.username}</strong></Link>
                                                {u.isVerified && <span title="Verified" style={{ marginLeft: '4px', color: '#1e90ff', fontWeight: 'bold', fontSize: '10px' }}>[V]</span>}
                                                {u.isShadowbanned && <span title="Shadowbanned" style={{ marginLeft: '4px', color: 'gray', fontSize: '10px' }}>[SB]</span>}
                                                <div style={{ fontSize: '10px', color: 'gray' }}>{u.email}</div>
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                                {currentUser.role === 'Admin' ? (
                                                    <select className="forum-input" value={u.role} style={{ width: 'auto', padding: '2px', fontSize: '10px' }}
                                                        disabled={u._id === (currentUser._id || currentUser.id)}
                                                        onChange={async (e) => { await changeRoleApi(u._id, e.target.value); fetchUsers(); }}>
                                                        <option value="Member">Member</option>
                                                        <option value="Moderator">Moderator</option>
                                                        <option value="Admin">Admin</option>
                                                    </select>
                                                ) : <span>{u.role}</span>}
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>
                                                {u.isBanned ? <span style={{ color: 'red', fontWeight: 'bold' }}>BANNED</span> : <span style={{ color: 'green' }}>Active</span>}
                                                {u.isBanned && <div style={{ fontSize: '9px', color: 'gray' }}>{u.banReason}</div>}
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'center' }}>{u.warnings?.length || 0}</td>
                                            <td style={{ padding: '8px', textAlign: 'right' }}>
                                                <div style={{ display: 'flex', gap: '3px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                                    <button className="forum-btn forum-btn-sm" title="Warn" disabled={u._id === (currentUser._id || currentUser.id)}
                                                        onClick={() => setWarnModal({ open: true, userId: u._id, reason: '' })}>[Warn]</button>
                                                    <button className="forum-btn forum-btn-sm" title={u.isBanned ? 'Unban' : 'Ban'} disabled={u._id === (currentUser._id || currentUser.id)}
                                                        onClick={() => {
                                                            if (u.isBanned) { banUserApi(u._id, false, '').then(fetchUsers); }
                                                            else { setBanModal({ open: true, userId: u._id, reason: '', isBanned: true }); }
                                                        }}>{u.isBanned ? '[Unban]' : '[Ban]'}</button>
                                                    <button className="forum-btn forum-btn-sm" title={u.isVerified ? 'Unverify' : 'Verify'}
                                                        onClick={async () => { await verifyUserApi(u._id); fetchUsers(); }}>[Verify]</button>
                                                    <button className="forum-btn forum-btn-sm" title={u.isShadowbanned ? 'Un-shadowban' : 'Shadowban'}
                                                        onClick={async () => { await shadowbanUserApi(u._id); fetchUsers(); }}>[Shadow]</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                {/* ===== TAB: CONTENT MODERATION ===== */}
                {activeTab === 'moderation' && (
                    <>
                        <div className="forum-panel-header">::  Content Moderation ::</div>

                        {/* Report Queue */}
                        <div className="forum-panel-body" style={{ background: 'var(--forum-white)' }}>
                            <h4 style={{ borderBottom: '1px solid var(--forum-border-light)', paddingBottom: '5px', marginBottom: '10px' }}>[*] Report Queue ({reports.filter(r => r.status === 'Pending').length} pending)</h4>
                            {reports.filter(r => r.status === 'Pending').length === 0 ? (
                                <p style={{ color: 'gray', fontStyle: 'italic' }}>No pending reports. All clear!</p>
                            ) : (
                                reports.filter(r => r.status === 'Pending').map(r => (
                                    <div key={r._id} style={{ padding: '8px', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <strong>{r.itemType}</strong> reported by <Link to={`/profile/${r.reporter?._id}`}>{r.reporter?.username}</Link>
                                            <div style={{ fontSize: '11px', color: 'gray' }}>Reason: {r.reason}</div>
                                            <div style={{ fontSize: '10px', color: 'gray' }}>{new Date(r.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '5px' }}>
                                            <button className="forum-btn forum-btn-sm" style={{ color: 'red' }} onClick={async () => { await resolveReportApi(r._id, 'Resolved'); fetchReports(); }}>Delete Content</button>
                                            <button className="forum-btn forum-btn-sm" onClick={async () => { await resolveReportApi(r._id, 'Dismissed'); fetchReports(); }}>Dismiss</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Keyword Filter */}
                        <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)', borderTop: '2px solid var(--forum-border)' }}>
                            <h4 style={{ borderBottom: '1px solid var(--forum-border-light)', paddingBottom: '5px', marginBottom: '10px' }}>[X] Keyword Filter</h4>
                            <p style={{ fontSize: '11px', color: 'gray', marginBottom: '8px' }}>Comma-separated list of banned words. Posts containing these words will be rejected.</p>
                            <textarea className="forum-textarea" style={{ height: '60px' }} value={bannedWords} onChange={e => setBannedWords(e.target.value)} placeholder="spam, badword1, badword2" />
                            <div className="text-right mt-sm">
                                <button className="forum-btn forum-btn-primary" onClick={async () => { await updateSettingApi('banned_words', bannedWords); alert('Saved!'); }}>Save Keywords</button>
                            </div>
                        </div>

                        {/* Audit Logs */}
                        <div className="forum-panel-body" style={{ background: 'var(--forum-white)', borderTop: '2px solid var(--forum-border)' }}>
                            <h4 style={{ borderBottom: '1px solid var(--forum-border-light)', paddingBottom: '5px', marginBottom: '10px' }}>{'[>]'} Audit Logs (Last 100)</h4>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {auditLogs.map(log => (
                                    <div key={log._id} style={{ padding: '5px 0', borderBottom: '1px solid var(--forum-border-light)', fontSize: '11px' }}>
                                        <strong>{log.admin?.username}</strong> — <span style={{ color: 'var(--forum-header-dark)' }}>{log.action}</span>
                                        {log.details && <span style={{ color: 'gray' }}> ({log.details})</span>}
                                        <span style={{ float: 'right', color: 'gray' }}>{new Date(log.createdAt).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {/* ===== TAB: ANALYTICS ===== */}
                {activeTab === 'analytics' && (
                    <>
                        <div className="forum-panel-header">:: Analytics & Growth ::</div>
                        <div className="forum-panel-body" style={{ background: 'var(--forum-white)' }}>
                            {analytics ? (
                                <>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '20px' }}>
                                        {[
                                            { label: 'Total Users', value: analytics.totalUsers, color: '#4a90d9' },
                                            { label: 'Total Posts', value: analytics.totalPosts, color: '#5cb85c' },
                                            { label: 'Total Comments', value: analytics.totalComments, color: '#f0ad4e' },
                                            { label: 'DAU (Today)', value: analytics.dau, color: '#d9534f' },
                                        ].map((card, i) => (
                                            <div key={i} style={{ padding: '15px', border: `2px solid ${card.color}`, textAlign: 'center', background: '#fafafa' }}>
                                                <div style={{ fontSize: '28px', fontWeight: 'bold', color: card.color }}>{card.value}</div>
                                                <div style={{ fontSize: '11px', color: 'gray', marginTop: '4px' }}>{card.label}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                        <div style={{ border: '1px solid var(--forum-border-light)', padding: '10px' }}>
                                            <h4 style={{ marginBottom: '8px' }}>[+] Today's Activity</h4>
                                            <p>Posts Today: <strong>{analytics.postsToday}</strong></p>
                                            <p>New Users Today: <strong>{analytics.newUsersToday}</strong></p>
                                            <p>MAU (This Month): <strong>{analytics.mau}</strong></p>
                                        </div>
                                        <div style={{ border: '1px solid var(--forum-border-light)', padding: '10px' }}>
                                            <h4 style={{ marginBottom: '8px' }}>[!] Top Posts (by Likes)</h4>
                                            {analytics.topPosts?.map((p, i) => (
                                                <div key={i} style={{ padding: '4px 0', borderBottom: '1px solid #eee', fontSize: '11px' }}>
                                                    <Link to={`/thread/${p._id}`}>{p.title}</Link> — {p.likes} likes <span style={{ color: 'gray' }}>by {p.author}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : <p>Loading analytics...</p>}
                        </div>
                    </>
                )}

                {/* ===== TAB: COMMUNICATION ===== */}
                {activeTab === 'comms' && (
                    <>
                        <div className="forum-panel-header">:: Communication & Support ::</div>

                        {/* Announcements */}
                        <div className="forum-panel-body" style={{ background: 'var(--forum-white)' }}>
                            <h4 style={{ borderBottom: '1px solid var(--forum-border-light)', paddingBottom: '5px', marginBottom: '10px' }}>[!] Send Global Announcement</h4>
                            <textarea className="forum-textarea" style={{ height: '60px' }} value={announcement} onChange={e => setAnnouncement(e.target.value)} placeholder="Type a system-wide announcement..." />
                            <div className="text-right mt-sm">
                                <button className="forum-btn forum-btn-primary" onClick={async () => {
                                    if (!announcement.trim()) return;
                                    await sendAnnouncementApi(announcement);
                                    setAnnouncement('');
                                    alert('Announcement broadcast!');
                                }}>Broadcast</button>
                            </div>
                        </div>

                        {/* Support Tickets */}
                        <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)', borderTop: '2px solid var(--forum-border)' }}>
                            <h4 style={{ borderBottom: '1px solid var(--forum-border-light)', paddingBottom: '5px', marginBottom: '10px' }}>[?] Support Tickets ({tickets.filter(t => t.status === 'Open').length} open)</h4>
                            {tickets.length === 0 ? (
                                <p style={{ color: 'gray', fontStyle: 'italic' }}>No tickets.</p>
                            ) : (
                                tickets.map(t => (
                                    <div key={t._id} style={{ padding: '10px', borderBottom: '1px solid var(--forum-border-light)', background: t.status === 'Open' ? '#fffde7' : '#f5f5f5' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <div>
                                                <strong>{t.subject}</strong> <span style={{ fontSize: '10px', color: t.status === 'Open' ? 'orange' : 'gray' }}>[{t.status}]</span>
                                                <div style={{ fontSize: '11px', color: 'gray' }}>by {t.user?.username} — {new Date(t.createdAt).toLocaleString()}</div>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '12px', marginTop: '5px', padding: '8px', background: '#fff', border: '1px solid #eee' }}>{t.message}</p>
                                        {t.replies?.map((r, i) => (
                                            <div key={i} style={{ fontSize: '11px', padding: '5px 8px', marginTop: '3px', background: '#eef', borderLeft: '3px solid var(--forum-header-dark)' }}>
                                                <strong>{r.sender?.username}:</strong> {r.message}
                                            </div>
                                        ))}
                                        {t.status === 'Open' && (
                                            <div style={{ marginTop: '8px', display: 'flex', gap: '5px' }}>
                                                <input className="forum-input" style={{ flexGrow: 1, padding: '4px 8px' }} placeholder="Type a reply..."
                                                    value={ticketReply[t._id] || ''} onChange={e => setTicketReply({ ...ticketReply, [t._id]: e.target.value })} />
                                                <button className="forum-btn forum-btn-sm" onClick={async () => {
                                                    if (!ticketReply[t._id]?.trim()) return;
                                                    await replyToTicketApi(t._id, ticketReply[t._id]);
                                                    setTicketReply({ ...ticketReply, [t._id]: '' });
                                                    fetchTickets();
                                                }}>Reply</button>
                                                <button className="forum-btn forum-btn-sm" style={{ color: 'red' }} onClick={async () => {
                                                    await replyToTicketApi(t._id, 'Ticket closed.', true);
                                                    fetchTickets();
                                                }}>Close</button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* === WARN MODAL === */}
            {warnModal.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '20px', border: '2px solid var(--forum-border-dark)', width: '400px' }}>
                        <h3 style={{ marginBottom: '10px' }}>[!] Issue Warning</h3>
                        <p style={{ fontSize: '12px', color: 'gray', marginBottom: '10px' }}>This warning will appear in the user's notifications.</p>
                        <textarea className="forum-textarea" style={{ height: '80px' }} value={warnModal.reason} onChange={e => setWarnModal({ ...warnModal, reason: e.target.value })} placeholder="Describe the reason for the warning..." />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                            <button className="forum-btn" onClick={() => setWarnModal({ open: false, userId: null, reason: '' })}>Cancel</button>
                            <button className="forum-btn forum-btn-primary" onClick={async () => {
                                if (!warnModal.reason.trim()) return alert('Please provide a reason.');
                                await warnUserApi(warnModal.userId, warnModal.reason);
                                setWarnModal({ open: false, userId: null, reason: '' });
                                fetchUsers();
                            }}>Send Warning</button>
                        </div>
                    </div>
                </div>
            )}

            {/* === BAN MODAL === */}
            {banModal.open && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ background: '#fff', padding: '20px', border: '2px solid red', width: '400px' }}>
                        <h3 style={{ marginBottom: '10px', color: 'red' }}>[X] Ban User</h3>
                        <p style={{ fontSize: '12px', color: 'gray', marginBottom: '10px' }}>The user will be immediately locked out of their account.</p>
                        <textarea className="forum-textarea" style={{ height: '80px' }} value={banModal.reason} onChange={e => setBanModal({ ...banModal, reason: e.target.value })} placeholder="Describe the reason for the ban..." />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                            <button className="forum-btn" onClick={() => setBanModal({ open: false, userId: null, reason: '' })}>Cancel</button>
                            <button className="forum-btn" style={{ background: 'red', color: '#fff', border: '1px solid darkred' }} onClick={async () => {
                                if (!banModal.reason.trim()) return alert('Please provide a reason.');
                                await banUserApi(banModal.userId, true, banModal.reason);
                                setBanModal({ open: false, userId: null, reason: '' });
                                fetchUsers();
                            }}>Confirm Ban</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;
