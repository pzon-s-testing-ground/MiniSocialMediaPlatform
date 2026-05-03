import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchApi } from '../api/searchApi';
import PostCard from '../components/PostCard';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialType = searchParams.get('type') || 'all';

    const [query, setQuery] = useState(initialQuery);
    const [activeType, setActiveType] = useState(initialType);
    const [results, setResults] = useState({ posts: [], users: [] });
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Pagination
    const [postPage, setPostPage] = useState(1);
    const [userPage, setUserPage] = useState(1);
    const [totalPostPages, setTotalPostPages] = useState(0);
    const [totalUserPages, setTotalUserPages] = useState(0);

    const performSearch = async (q, type, pPage, uPage) => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const page = type === 'users' ? uPage : pPage;
            const res = await searchApi(q, type, page, 10);
            setResults({ posts: res.data.posts || [], users: res.data.users || [] });
            setTotalPostPages(res.data.totalPostPages || 0);
            setTotalUserPages(res.data.totalUserPages || 0);
            setSearched(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialQuery) {
            performSearch(initialQuery, activeType, postPage, userPage);
        }
    }, []);

    useEffect(() => {
        if (searched && query.trim()) {
            performSearch(query, activeType, postPage, userPage);
        }
    }, [postPage, userPage, activeType]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        setPostPage(1);
        setUserPage(1);
        setSearchParams({ q: query, type: activeType });
        performSearch(query, activeType, 1, 1);
    };

    const handleTypeChange = (type) => {
        setActiveType(type);
        setPostPage(1);
        setUserPage(1);
        setSearchParams({ q: query, type });
    };

    const typeFilters = [
        { id: 'all', label: 'All Results' },
        { id: 'posts', label: 'Threads' },
        { id: 'users', label: 'Members' },
    ];

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Search
            </div>

            {/* Search Form */}
            <div className="forum-panel">
                <div className="forum-panel-header">Forum Search</div>
                <div className="forum-panel-body">
                    <form onSubmit={handleSearch}>
                        <div style={{ display: 'flex', gap: 'var(--forum-gap-md)' }}>
                            <input
                                id="search-input"
                                className="forum-input"
                                type="text"
                                placeholder="Enter search keywords..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ flexGrow: 1 }}
                            />
                            <button type="submit" className="forum-btn forum-btn-primary" disabled={loading}>
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Type Tabs */}
            {searched && (
                <>
                    <div className="search-type-tabs" style={{ display: 'flex', gap: '2px', marginBottom: '0' }}>
                        {typeFilters.map(t => (
                            <button key={t.id} onClick={() => handleTypeChange(t.id)}
                                className="forum-btn"
                                style={{
                                    padding: '6px 14px',
                                    borderBottom: activeType === t.id ? '3px solid var(--forum-header-dark)' : '3px solid transparent',
                                    fontWeight: activeType === t.id ? 'bold' : 'normal',
                                    background: activeType === t.id ? 'var(--forum-header-dark)' : 'var(--forum-row-even)',
                                    color: activeType === t.id ? '#fff' : 'var(--forum-text)',
                                    cursor: 'pointer', fontSize: '12px'
                                }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="forum-panel" style={{ borderTop: '3px solid var(--forum-header-dark)' }}>
                        {loading ? (
                            <div className="forum-loading">Searching...</div>
                        ) : (
                            <>
                                {/* Thread Results */}
                                {(activeType === 'all' || activeType === 'posts') && (
                                    <div>
                                        <div className="forum-category-header">
                                            <div className="col-topic">Thread Results ({results.posts.length}{totalPostPages > 1 ? '+' : ''})</div>
                                            <div className="col-author">Author</div>
                                            <div className="col-replies">Likes</div>
                                            <div className="col-lastpost">Date</div>
                                        </div>
                                        {results.posts.length === 0 ? (
                                            <div style={{ padding: 'var(--forum-gap-lg)', textAlign: 'center', color: 'gray', fontStyle: 'italic' }}>
                                                No threads found matching "{query}".
                                            </div>
                                        ) : (
                                            <>
                                                {results.posts.map(post => (
                                                    <PostCard key={post._id} post={post} />
                                                ))}
                                                {totalPostPages > 1 && activeType !== 'all' && (
                                                    <div className="search-pagination" style={{ padding: 'var(--forum-gap-md)', background: 'var(--forum-row-even)', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                                        <button className="forum-btn forum-btn-sm" disabled={postPage === 1} onClick={() => setPostPage(postPage - 1)}>&lt; Prev</button>
                                                        <span style={{ padding: '0 10px', background: 'var(--forum-white)', border: '1px solid var(--forum-border-light)' }}>Page {postPage} of {totalPostPages}</span>
                                                        <button className="forum-btn forum-btn-sm" disabled={postPage >= totalPostPages} onClick={() => setPostPage(postPage + 1)}>Next &gt;</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* User Results */}
                                {(activeType === 'all' || activeType === 'users') && (
                                    <div>
                                        <div className="forum-category-header" style={{ marginTop: activeType === 'all' ? '0' : '0' }}>
                                            <div className="col-topic">Member Results ({results.users.length}{totalUserPages > 1 ? '+' : ''})</div>
                                            <div className="col-author">Role</div>
                                            <div className="col-replies">Posts</div>
                                            <div className="col-lastpost">Joined</div>
                                        </div>
                                        {results.users.length === 0 ? (
                                            <div style={{ padding: 'var(--forum-gap-lg)', textAlign: 'center', color: 'gray', fontStyle: 'italic' }}>
                                                No members found matching "{query}".
                                            </div>
                                        ) : (
                                            <>
                                                {results.users.map(u => (
                                                    <div key={u._id} className="forum-thread-row">
                                                        <div className="thread-icon">[USER]</div>
                                                        <div className="thread-title">
                                                            <Link to={`/profile/${u._id}`} style={{ fontWeight: 'bold' }}>{u.username}</Link>
                                                            {u.isVerified && <span style={{ marginLeft: '4px', color: '#1e90ff', fontSize: '10px', fontWeight: 'bold' }}>[V]</span>}
                                                            <div className="thread-preview">{u.bio || 'No biography.'}</div>
                                                        </div>
                                                        <div className="thread-author">
                                                            <span style={{ 
                                                                color: u.role === 'Admin' ? 'red' : u.role === 'Moderator' ? '#1e90ff' : 'inherit',
                                                                fontWeight: u.role !== 'Member' ? 'bold' : 'normal'
                                                            }}>{u.role}</span>
                                                        </div>
                                                        <div className="thread-replies">
                                                            {u.followers?.length || 0} followers
                                                        </div>
                                                        <div className="thread-lastpost">
                                                            {new Date(u.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                ))}
                                                {totalUserPages > 1 && activeType !== 'all' && (
                                                    <div className="search-pagination" style={{ padding: 'var(--forum-gap-md)', background: 'var(--forum-row-even)', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                                                        <button className="forum-btn forum-btn-sm" disabled={userPage === 1} onClick={() => setUserPage(userPage - 1)}>&lt; Prev</button>
                                                        <span style={{ padding: '0 10px', background: 'var(--forum-white)', border: '1px solid var(--forum-border-light)' }}>Page {userPage} of {totalUserPages}</span>
                                                        <button className="forum-btn forum-btn-sm" disabled={userPage >= totalUserPages} onClick={() => setUserPage(userPage + 1)}>Next &gt;</button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* No results at all */}
                                {results.posts.length === 0 && results.users.length === 0 && (
                                    <div style={{ padding: 'var(--forum-gap-xl)', textAlign: 'center' }}>
                                        <div style={{ fontSize: 'var(--forum-font-size-lg)', fontWeight: 'bold', marginBottom: 'var(--forum-gap-md)' }}>
                                            No results found for "{query}"
                                        </div>
                                        <div className="text-muted">Try different keywords or check your spelling.</div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchPage;
