import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPostByIdApi, likePostApi } from '../api/postApi';
import { getCommentsApi, createCommentApi } from '../api/commentApi';
import CommentBox from '../components/CommentBox';
import { useSelector } from 'react-redux';

const ThreadPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchThread = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    getPostByIdApi(id),
                    getCommentsApi(id)
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data);
                setLoading(false);
            } catch (err) {
                setError('Thread not found or error loading.');
                setLoading(false);
            }
        };
        fetchThread();
    }, [id]);

    const handleReply = async (e) => {
        e.preventDefault();
        if (!replyText.trim()) return;
        try {
            const res = await createCommentApi(id, replyText);
            // Cập nhật lại list comment (chèn cái mới lên hoặc nạp lại)
            setComments([res.data, ...comments]);
            setReplyText('');
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
                <div className="forum-panel-header">
                    <span>Thread: {post.content.substring(0, 30)}...</span>
                </div>

                {/* Original Post */}
                <CommentBox comment={{...post, text: post.content}} />
                
                <div style={{ background: 'var(--forum-white)', padding: 'var(--forum-gap-md)', borderBottom: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end' }}>
                    <button className={`forum-like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
                        {isLiked ? 'Unlike' : 'Like'} ({post.likes?.length || 0})
                    </button>
                </div>

                {/* Replies */}
                {comments.map(c => (
                    <CommentBox key={c._id} comment={c} />
                ))}

                <div className="forum-panel-body" style={{ background: 'var(--forum-row-even)' }}>
                    <form onSubmit={handleReply}>
                        <h3 style={{ fontSize: 'var(--forum-font-size)', borderBottom: '1px solid var(--forum-border-light)', paddingBottom: 'var(--forum-gap-sm)' }}>Quick Reply</h3>
                        <textarea
                            className="forum-textarea"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply here..."
                            required
                        ></textarea>
                        <div className="text-right mt-sm">
                            <button type="submit" className="forum-btn forum-btn-primary">Post Reply</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ThreadPage;
