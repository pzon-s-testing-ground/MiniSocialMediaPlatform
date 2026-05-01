import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="forum-thread-row">
            <div className="thread-icon">
                {post.isPinned ? '[PINNED]' : post.isLocked ? '[LOCKED]' : '[THREAD]'}
            </div>
            <div className="thread-title">
                {post.isDeleted ? (
                    <span style={{ fontStyle: 'italic', color: 'gray' }}>[This thread was deleted by admin]</span>
                ) : (
                    <Link to={`/thread/${post._id}`}>{post.title || post.content.substring(0, 50) + '...'}</Link>
                )}
                <div className="thread-preview">Started by <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link></div>
            </div>
            <div className="thread-author">
                <Link to={`/profile/${post.author._id}`}>{post.author.username}</Link>
            </div>
            <div className="thread-replies">
                {post.likes?.length || 0} Likes
            </div>
            <div className="thread-lastpost">
                {new Date(post.createdAt).toLocaleString()}
            </div>
        </div>
    );
};

export default PostCard;
