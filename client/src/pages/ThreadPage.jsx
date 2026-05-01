import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostByIdApi, likePostApi, lockPostApi, pinPostApi, deletePostApi } from '../api/postApi';
import { getCommentsApi, createCommentApi, deleteCommentApi } from '../api/commentApi';
import CommentBox from '../components/CommentBox';
import BBCodeEditor from '../components/BBCodeEditor';
import { useSelector } from 'react-redux';

const ThreadPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Pagination for comments
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    getPostByIdApi(id),
                    getCommentsApi(id, page, 20)
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data.comments);
                setTotalPages(commentsRes.data.totalPages);
                setLoading(false);
            } catch (err) {
                setError('Thread not found or error loading.');
                setLoading(false);
            }
        };
        fetchThread();
    }, [id, page]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            await createCommentApi(id, replyText);
            setReplyText('');
            
            // Reload comments
            const commentsRes = await getCommentsApi(id, page, 20);
            setComments(commentsRes.data.comments);
            setTotalPages(commentsRes.data.totalPages);
        } catch (err) {
            alert('Error posting reply');
        }
    };

    const handleLike = async () => {
        try {
            const res = await likePostApi(id);
            setPost({ ...post, likes: res.data.likes });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeletePost = async () => {
        if (!window.confirm('Delete this thread?')) return;
        try {
            await deletePostApi(id);
            setPost({ ...post, isDeleted: true, deletedBy: (user.role === 'Admin' || user.role === 'Moderator') ? 'admin' : 'author' });
        } catch (err) {
            alert('Error deleting post');
        }
    };

    const handleLockPost = async () => {
        try {
            const res = await lockPostApi(id);
            setPost({ ...post, isLocked: res.data.isLocked });
        } catch (err) {
            alert('Error locking post');
        }
    };

    const handlePinPost = async () => {
        try {
            const res = await pinPostApi(id);
            setPost({ ...post, isPinned: res.data.isPinned });
        } catch (err) {
            alert('Error pinning post');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await deleteCommentApi(commentId);
            const commentsRes = await getCommentsApi(id, page, 20);
            setComments(commentsRes.data.comments);
        } catch (err) {
            alert('Error deleting comment');
        }
    };

    if (loading) return <div className="forum-loading">Loading thread...</div>;
    if (error) return <div className="forum-alert forum-alert-error">{error}</div>;
    if (!post) return null;

    const isLiked = user && post.likes?.includes(user._id || user.id);

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Thread View
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>
                        {post.isPinned && '📌 '}
                        {post.isLocked && '🔒 '}
                        Thread: {post.title || post.content.substring(0, 30) + '...'}
                    </span>
                    {(user?.role === 'Admin' || user?.role === 'Moderator') && (
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <button className="forum-btn forum-btn-sm" onClick={handlePinPost}>{post.isPinned ? 'Unpin' : 'Pin'}</button>
                            <button className="forum-btn forum-btn-sm" onClick={handleLockPost}>{post.isLocked ? 'Unlock' : 'Lock'}</button>
                            {!post.isDeleted && <button className="forum-btn forum-btn-sm" style={{ color: 'red' }} onClick={handleDeletePost}>Delete</button>}
                        </div>
                    )}
                </div>

                {/* Original Post */}
                <CommentBox comment={{...post, text: post.content}} onDelete={handleDeletePost} />
                
                <div style={{ background: 'var(--forum-white)', padding: 'var(--forum-gap-md)', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className={`forum-like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        {isLiked ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
                    </button>
                </div>

                {/* Pagination (Top) */}
                {totalPages > 1 && (
                    <div style={{ padding: 'var(--forum-gap-md)', background: 'var(--forum-row-even)', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                        <button className="forum-btn forum-btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</button>
                        <span style={{ padding: '0 10px', background: 'var(--forum-white)', border: '1px solid var(--forum-border-light)' }}>Page {page} of {totalPages}</span>
                        <button className="forum-btn forum-btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next &gt;</button>
                    </div>
                )}

                {/* Replies */}
                {comments.map(c => (
                    <CommentBox key={c._id} comment={c} onDelete={handleDeleteComment} />
                ))}

                {/* Pagination (Bottom) */}
                {totalPages > 1 && (
                    <div style={{ padding: 'var(--forum-gap-md)', background: 'var(--forum-row-even)', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                        <button className="forum-btn forum-btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>&lt; Prev</button>
                        <span style={{ padding: '0 10px', background: 'var(--forum-white)', border: '1px solid var(--forum-border-light)' }}>Page {page} of {totalPages}</span>
                        <button className="forum-btn forum-btn-sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next &gt;</button>
                    </div>
                )}

                {post.isLocked ? (
                    <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)', textAlign: 'center', padding: 'var(--forum-gap-lg)' }}>
                        <span style={{ fontStyle: 'italic', color: 'gray' }}>🔒 This thread has been locked. You cannot reply.</span>
                    </div>
                ) : (
                    <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)' }}>
                        <form onSubmit={handleReply}>
                            <h3 style={{ fontSize: 'var(--forum-font-size)', borderBottom: '1px solid var(--forum-border-light)', paddingBottom: 'var(--forum-gap-sm)', marginBottom: 'var(--forum-gap-md)' }}>Quick Reply</h3>
                            <BBCodeEditor 
                                value={replyText} 
                                onChange={setReplyText} 
                                placeholder="Type your reply here... (Use BBCode for formatting)" 
                            />
                            <div className="text-right mt-sm">
                                <button type="submit" className="forum-btn forum-btn-primary">Post Reply</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ThreadPage;
