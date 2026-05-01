import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="forum-navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="forum-navbar-links">
                [ <Link to="/" title="Home">home</Link> 
                {user ? (
                    <>
                        {' / '}<Link to={`/profile/${user._id || user.id}`} title="Profile">profile</Link> 
                        {' / '}<Link to="/messages" title="Messages">messages</Link> 
                        {' / '}<Link to="/notifications" title="Notifications">notifications</Link> 
                        {' / '}<a href="#" onClick={handleLogout} title="Logout">logout</a> ]
                    </>
                ) : (
                    <>
                        {' / '}<Link to="/login" title="Login">login</Link> 
                        {' / '}<Link to="/register" title="Register">register</Link> ]
                    </>
                )}
            </div>
            <div className="forum-navbar-user" style={{ fontSize: 'var(--forum-font-size-sm)', color: 'var(--forum-text-muted)' }}>
                {user && <span>Logged in as <strong>{user.username}</strong></span>}
            </div>
        </div>
    );
};

export default Navbar;
