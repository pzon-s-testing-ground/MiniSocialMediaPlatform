import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmailApi } from '../api/authApi';

const VerifyEmailPage = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await verifyEmailApi(token);
                setStatus('success');
                setMessage(res.data.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="forum-wrapper">
            <div className="forum-panel mt-lg" style={{ maxWidth: '600px', margin: '100px auto' }}>
                <div className="forum-panel-header">
                    Email Verification
                </div>
                <div className="forum-panel-body" style={{ textAlign: 'center', padding: 'var(--forum-gap-xl)' }}>
                    {status === 'verifying' && (
                        <div>
                            <div className="forum-loading">Verifying your email...</div>
                        </div>
                    )}
                    
                    {status === 'success' && (
                        <div>
                            <div className="forum-alert forum-alert-success" style={{ marginBottom: 'var(--forum-gap-lg)' }}>
                                {message}
                            </div>
                            <p>Your account is now active. You can now log in to participate in the community.</p>
                            <Link to="/login" className="forum-btn forum-btn-primary mt-md" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                Go to Login
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div>
                            <div className="forum-alert forum-alert-error" style={{ marginBottom: 'var(--forum-gap-lg)' }}>
                                {message}
                            </div>
                            <p>Please try registering again or contact support if the issue persists.</p>
                            <Link to="/register" className="forum-btn mt-md" style={{ display: 'inline-block', textDecoration: 'none' }}>
                                Back to Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
