import { Link } from 'react-router-dom';

const CommentBox = ({ comment }) => {
    return (
        <div className="forum-post-box">
            <div className="forum-post-sidebar">
                <div className="post-username">
                    <Link to={`/profile/${comment.author._id}`}>{comment.author.username}</Link>
                </div>
                <div className="post-rank">Member</div>
                <div className="post-avatar">
                    {comment.author.avatar ? (
                        <img src={comment.author.avatar.startsWith('http') ? comment.author.avatar : `http://localhost:5000${comment.author.avatar}`} alt="Avatar" />
                    ) : (
                        <span>?</span>
                    )}
                </div>
                <div className="post-stats">
                    Posts: N/A<br />
                    Joined: {new Date(comment.author.createdAt).toLocaleDateString()}
                </div>
            </div>
            <div className="forum-post-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="forum-post-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Posted: {new Date(comment.createdAt).toLocaleString()}</span>
                    <span style={{ display: 'flex', gap: 'var(--forum-gap-lg)', alignItems: 'center' }}>
                        <a href="#" title="Quote" style={{ textDecoration: 'none', filter: 'grayscale(100%)', opacity: 0.7 }}>💬</a>
                        <a href="#" title="Report" style={{ textDecoration: 'none', filter: 'grayscale(100%)', opacity: 0.7 }}>🚩</a>
                        <span>#{comment._id.substring(0, 4)}</span>
                    </span>
                </div>
                <div className="forum-post-body" style={{ flexGrow: 1 }}>
                    {comment.text || comment.content}
                </div>
            </div>
        </div>
    );
};

export default CommentBox;
