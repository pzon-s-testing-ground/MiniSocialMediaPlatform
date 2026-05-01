import { useEffect, useState } from 'react';
import { getUsersApi, banUserApi, warnUserApi, changeRoleApi } from '../api/adminApi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getUsersApi();
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleBan = async (id, isCurrentlyBanned) => {
        let reason = '';
        if (!isCurrentlyBanned) {
            reason = prompt('Enter ban reason:');
            if (reason === null) return; // cancelled
        }
        try {
            await banUserApi(id, !isCurrentlyBanned, reason);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error banning user');
        }
    };

    const handleWarn = async (id) => {
        const reason = prompt('Enter warning reason:');
        if (!reason) return;
        try {
            await warnUserApi(id, reason);
            fetchUsers();
            alert('Warning sent');
        } catch (err) {
            alert('Error warning user');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        if (!window.confirm(`Change role to ${newRole}?`)) return;
        try {
            await changeRoleApi(id, newRole);
            fetchUsers();
        } catch (err) {
            alert(err.response?.data?.message || 'Error changing role');
        }
    };

    if (loading) return <div className="forum-loading">Loading Admin Panel...</div>;
    
    if (currentUser?.role !== 'Admin' && currentUser?.role !== 'Moderator') {
        return <div className="forum-alert forum-alert-error">Access Denied.</div>;
    }

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Administration Panel
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">User Management</div>
                <div className="forum-panel-body" style={{ background: 'var(--forum-white)' }}>
                    <table className="forum-stats-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', paddingBottom: '10px' }}>Username</th>
                                <th style={{ textAlign: 'left', paddingBottom: '10px' }}>Role</th>
                                <th style={{ textAlign: 'center', paddingBottom: '10px' }}>Status</th>
                                <th style={{ textAlign: 'center', paddingBottom: '10px' }}>Warnings</th>
                                <th style={{ textAlign: 'right', paddingBottom: '10px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} style={{ borderBottom: '1px solid var(--forum-border-light)' }}>
                                    <td style={{ padding: '10px 0' }}>
                                        <Link to={`/profile/${u._id}`}><strong>{u.username}</strong></Link>
                                    </td>
                                    <td>
                                        {currentUser.role === 'Admin' ? (
                                            <select 
                                                className="forum-input" 
                                                value={u.role} 
                                                onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                                style={{ width: 'auto', padding: '2px 5px', fontSize: '11px' }}
                                                disabled={u._id === currentUser._id}
                                            >
                                                <option value="Member">Member</option>
                                                <option value="Moderator">Moderator</option>
                                                <option value="Admin">Admin</option>
                                            </select>
                                        ) : (
                                            u.role
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        {u.isBanned ? <span style={{ color: 'red', fontWeight: 'bold' }}>BANNED</span> : <span style={{ color: 'green' }}>Active</span>}
                                        {u.isBanned && <div style={{ fontSize: '10px', color: 'gray' }}>{u.banReason}</div>}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{u.warnings?.length || 0}</td>
                                    <td style={{ textAlign: 'right', display: 'flex', gap: '5px', justifyContent: 'flex-end' }}>
                                        <button className="forum-btn forum-btn-sm" onClick={() => handleWarn(u._id)} disabled={u._id === currentUser._id}>Warn</button>
                                        <button className="forum-btn forum-btn-sm" onClick={() => handleBan(u._id, u.isBanned)} disabled={u._id === currentUser._id || (currentUser.role !== 'Admin' && u.role === 'Admin')}>
                                            {u.isBanned ? 'Unban' : 'Ban'}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
