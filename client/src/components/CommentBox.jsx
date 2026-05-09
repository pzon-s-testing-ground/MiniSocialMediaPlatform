import { Link } from 'react-router-dom';
import { parseBBCode } from '../utils/bbcodeParser';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import ReportModal from './ReportModal';
import BBCodeEditor from './BBCodeEditor';

const CommentBox = ({ comment, onDelete, onQuote, onEdit }) => {
    const { user } = useSelector(state => state.auth);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(comment.text || comment.content || '');
    const [editTitle, setEditTitle] = useState(comment.title || '');
    
    const isMod = user && (user.role === 'Admin' || user.role === 'Moderator');
    const isAuthor = user && (user._id === comment.author._id || user.id === comment.author._id);
    
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
                    <span>
                        Posted: {new Date(comment.createdAt).toLocaleString()}
                        {comment.editedAt && <span style={{ fontStyle: 'italic', color: 'gray', marginLeft: '5px' }}>(Edited: {new Date(comment.editedAt).toLocaleString()})</span>}
                    </span>
                    <span style={{ display: 'flex', gap: 'var(--forum-gap-lg)', alignItems: 'center' }}>
                        {(isMod || isAuthor) && !comment.isDeleted && (
                            <>
                                {isAuthor && onEdit && (
                                    <a href="#" onClick={(e) => { e.preventDefault(); setIsEditing(!isEditing); }} title="Edit" style={{ textDecoration: 'none', color: 'var(--forum-primary)' }}>[Edit]</a>
                                )}
                                <a href="#" onClick={(e) => { e.preventDefault(); onDelete(comment._id); }} title="Delete" style={{ textDecoration: 'none', color: 'red', fontWeight: 'bold' }}>[Delete]</a>
                            </>
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
                ) : isEditing ? (
                    <div className="forum-post-body" style={{ flexGrow: 1, padding: 'var(--forum-gap-md)' }}>
                        {comment.title !== undefined && (
                            <input 
                                type="text" 
                                className="forum-input" 
                                style={{ marginBottom: '10px' }} 
                                value={editTitle} 
                                onChange={e => setEditTitle(e.target.value)} 
                                placeholder="Thread Title"
                            />
                        )}
                        <BBCodeEditor value={editText} onChange={setEditText} />
                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button className="forum-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                            <button className="forum-btn forum-btn-primary" onClick={() => { onEdit(comment._id, editText, editTitle); setIsEditing(false); }}>Save Changes</button>
                        </div>
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
