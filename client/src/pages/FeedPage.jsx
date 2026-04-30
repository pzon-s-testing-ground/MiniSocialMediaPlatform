import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, createPost } from '../features/postSlice';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const FeedPage = () => {
    const dispatch = useDispatch();
    const { posts, loading } = useSelector((state) => state.posts);
    const { user } = useSelector((state) => state.auth);
    const [content, setContent] = useState('');

    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;
        dispatch(createPost({ content }));
        setContent('');
    };

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> General Discussion
            </div>

            <div className="forum-main-layout">
                <div className="forum-content-area">
                    <div className="forum-panel">
                        <div className="forum-panel-header">Create New Thread</div>
                        <div className="forum-panel-body">
                            <form onSubmit={handleSubmit}>
                                <textarea
                                    className="forum-textarea"
                                    placeholder="What's on your mind?"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows="3"
                                    required
                                ></textarea>
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
