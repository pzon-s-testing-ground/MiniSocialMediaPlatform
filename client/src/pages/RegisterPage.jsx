import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../features/authSlice';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState('');

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
        setValidationError('');

        if (password !== confirmPassword) {
            setValidationError('Passwords do not match!');
            return;
        }

        dispatch(registerUser({ username, email, password }));
    };

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Register
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">
                    New Member Registration
                </div>
                <div className="forum-panel-body flex-center">
                    <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
                        {(error || validationError) && (
                            <div className="forum-alert forum-alert-error mb-md">
                                {validationError || error}
                            </div>
                        )}
                        
                        <table className="forum-form-table">
                            <tbody>
                                <tr>
                                    <th><label htmlFor="username">Username:</label><div className="text-sm text-muted">Desired display name.</div></th>
                                    <td>
                                        <input 
                                            id="username"
                                            type="text" 
                                            className="forum-input" 
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th><label htmlFor="email">Email Address:</label><div className="text-sm text-muted">Must be valid.</div></th>
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
                                    <th><label htmlFor="confirmPassword">Confirm Password:</label></th>
                                    <td>
                                        <input 
                                            id="confirmPassword"
                                            type="password" 
                                            className="forum-input" 
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required 
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <th></th>
                                    <td>
                                        <button type="submit" className="forum-btn forum-btn-primary" disabled={loading}>
                                            {loading ? 'Registering...' : 'Register'}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-center mt-md text-sm">
                            Already registered? <Link to="/login">Log in here</Link>.
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
