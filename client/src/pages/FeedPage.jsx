import { useEffect, useState } from 'react';
import { getPostsApi, createPostApi } from '../api/postApi';
import PostCard from '../components/PostCard';
import BBCodeEditor from '../components/BBCodeEditor';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const FeedPage = () => {
    const [posts, setPosts] = useState([]);
    const [newPostContent, setNewPostContent] = useState('');
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostCategory, setNewPostCategory] = useState('General');
    const [loading, setLoading] = useState(true);
    
    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('All');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getPostsApi(page, 10, categoryFilter);
                setPosts(res.data.posts);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchPosts();
    }, [page, categoryFilter]);

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPostContent.trim() || !newPostTitle.trim()) return;
        try {
            await createPostApi(newPostContent, newPostTitle, newPostCategory);
            setNewPostContent('');
            setNewPostTitle('');
            
            // Reload page 1
            setPage(1);
            const res = await getPostsApi(1, 10, categoryFilter);
            setPosts(res.data.posts);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> General Discussion
            </div>

            <div className="forum-main-layout">
                <div className="forum-content-area">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--forum-gap-md)', alignItems: 'center' }}>
                        <div>
                            <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Category:</span>
                            <select className="forum-input" style={{ width: 'auto', display: 'inline-block' }} value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                                <option value="All">All Categories</option>
                                <option value="General">General</option>
                                <option value="Technology">Technology</option>
                                <option value="Off-Topic">Off-Topic</option>
                            </select>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="forum-btn forum-btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</button>
                            <span style={{ padding: '0 10px', background: 'var(--forum-white)', border: '1px solid var(--forum-border-light)' }}>Page {page} of {totalPages}</span>
                            <button className="forum-btn forum-btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next &gt;</button>
                        </div>
                    </div>

                    <div className="forum-panel">
                        <div className="forum-panel-header">Create New Thread</div>
                        <div className="forum-panel-body">
                            <form onSubmit={handleCreatePost}>
                                <input 
                                    className="forum-input" 
                                    placeholder="Thread Title" 
                                    value={newPostTitle} 
                                    onChange={(e) => setNewPostTitle(e.target.value)} 
                                    required 
                                />
                                <select className="forum-input" value={newPostCategory} onChange={(e) => setNewPostCategory(e.target.value)}>
                                    <option value="General">General</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Off-Topic">Off-Topic</option>
                                </select>
                                <BBCodeEditor value={newPostContent} onChange={setNewPostContent} />
                                <div className="text-right mt-sm">
                                    <button type="submit" className="forum-btn forum-btn-primary">Post New Thread</button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className="forum-panel">
                        <div className="forum-category-header">
                            <div className="col-topic">Thread / Author</div>
                            <div className="col-author">Author</div>
                            <div className="col-replies">Likes</div>
                            <div className="col-lastpost">Last Post</div>
                        </div>
                        <div>
                            {loading && <div className="forum-loading">Loading threads...</div>}
                            {!loading && posts.length === 0 && <div style={{ padding: 'var(--forum-gap-lg)', textAlign: 'center' }}>No threads found.</div>}
                            {!loading && posts.map(post => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ width: '250px' }}>
                    <Sidebar />
                </div>
            </div>
        </div>
    );
};

export default FeedPage;
