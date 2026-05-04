import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
    };

    return (
        <div className="forum-navbar">
            <div className="forum-navbar-inner">
                <div className="forum-navbar-left">
                    <button className="forum-navbar-toggle forum-btn forum-btn-sm" onClick={() => setMenuOpen(!menuOpen)}>
                        [{menuOpen ? 'close' : 'menu'}]
                    </button>
                    <div className={`forum-navbar-links ${menuOpen ? 'open' : ''}`}>
                        [ <Link to="/" title="Home">home</Link>
                        {user ? (
                            <>
                                { (user.role === 'Admin' || user.role === 'Moderator') && <>{' / '}<Link to="/admin" title="Admin Panel" style={{ color: 'red' }}>admin panel</Link></>}
                                {' / '}<Link to={`/profile/${user._id || user.id}`} title="Profile">profile</Link>
                                {' / '}<Link to="/messages" title="Messages">messages</Link>
                                {' / '}<Link to="/notifications" title="Notifications">notifications</Link>
                                {' / '}<Link to="/support" title="Support">support</Link>
                                {' / '}<Link to="/search" title="Search">search</Link>
                                {' / '}<a href="#" onClick={handleLogout} title="Logout">logout</a> ]
                            </>
                        ) : (
                            <>
                                {' / '}<Link to="/login" title="Login">login</Link>
                                {' / '}<Link to="/register" title="Register">register</Link> ]
                            </>
                        )}
                    </div>
                </div>
                <div className="forum-navbar-right">
                    {user && (
                        <form onSubmit={handleSearch} className="forum-navbar-search">
                            <input
                                type="text"
                                className="forum-input forum-navbar-search-input"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="submit" className="forum-btn forum-btn-sm">Go</button>
                        </form>
                    )}
                    <div className="forum-navbar-user">
                        {user && <span>Logged in as <strong>{user.username}</strong></span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
