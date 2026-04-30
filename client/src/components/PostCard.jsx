import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="forum-thread-row">
            <div className="thread-icon">
                📄
            </div>
            <div className="thread-title">
                <Link to={`/thread/${post._id}`}>{post.content.substring(0, 50)}{post.content.length > 50 ? '...' : ''}</Link>
                <div className="thread-preview">Started by {post.author.username}</div>
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
