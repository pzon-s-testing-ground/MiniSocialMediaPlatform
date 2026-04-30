import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        if (user) {
            navigate('/');
        }
        return () => {
            dispatch(clearError());
        };
    }, [user, navigate, dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password }));
    };

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Login
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">
                    User Control Panel - Login
                </div>
                <div className="forum-panel-body flex-center">
                    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '500px' }}>
                        {error && <div className="forum-alert forum-alert-error mb-md">{error}</div>}
                        
                        <table className="forum-form-table">
                            <tbody>
                                <tr>
                                    <th><label htmlFor="email">Email Address:</label></th>
                                    <td>
                                        <input 
                                            id="email"
                                            type="email" 
                                            className="forum-input" 
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th><label htmlFor="password">Password:</label></th>
                                    <td>
                                        <input 
                                            id="password"
                                            type="password" 
                                            className="forum-input" 
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td>
                                        <button type="submit" className="forum-btn forum-btn-primary" disabled={loading}>
                                            {loading ? 'Logging in...' : 'Log in'}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-center mt-md text-sm">
                            Not a member yet? <Link to="/register">Register here</Link>.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
