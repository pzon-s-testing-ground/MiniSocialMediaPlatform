import { Link } from 'react-router-dom';
import { parseBBCode } from '../utils/bbcodeParser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ReportModal from './ReportModal';

const CommentBox = ({ comment, onDelete, onQuote }) => {
    const { user } = useSelector(state => state.auth);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const isMod = user && (user.role === 'Admin' || user.role === 'Moderator');
    
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
                        {isMod && !comment.isDeleted && (
                            <a href="#" onClick={(e) => { e.preventDefault(); onDelete(comment._id); }} title="Delete" style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold' }}>[Delete]</a>
                        )}
                        <a href="#" onClick={(e) => { e.preventDefault(); onQuote && onQuote(comment.author.username, comment.text || comment.content); }} title="Quote" style={{ textDecoration: 'none' }}>💬</a>
                        <a href="#" onClick={(e) => { e.preventDefault(); setReportModalOpen(true); }} title="Report" style={{ textDecoration: 'none' }}>🚩</a>
                        <span>#{comment._id.substring(0, 4)}</span>
                    </span>
                </div>
                {comment.isDeleted ? (
                    <div className="forum-post-body" style={{ flexGrow: 1, fontStyle: 'italic', color: 'gray', padding: 'var(--forum-gap-md)' }}>
                        [This message was deleted by {comment.deletedBy}]
                    </div>
                ) : (
                    <div 
                        className="forum-post-body" 
                        style={{ flexGrow: 1 }}
                        dangerouslySetInnerHTML={{ __html: parseBBCode(comment.text || comment.content) }}
                    />
                )}
                
                <ReportModal 
                    isOpen={reportModalOpen} 
                    onClose={() => setReportModalOpen(false)} 
                    reportedItem={comment._id} 
                    itemType={comment.title ? 'Post' : 'Comment'} 
                />
            </div>
        </div>
    );
};

export default CommentBox;
