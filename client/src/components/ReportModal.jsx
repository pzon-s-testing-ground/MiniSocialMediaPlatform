import { useState } from 'react';
import { createReportApi } from '../api/actionApi';

const ReportModal = ({ isOpen, onClose, reportedItem, itemType }) => {
    const [reason, setReason] = useState('Spam');
    const [details, setDetails] = useState('');
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const finalReason = details ? `${reason}: ${details}` : reason;
            await createReportApi({
                reportedItem,
                itemType,
                reason: finalReason
            });
            alert('Report submitted successfully. Thank you for helping us moderate!');
            onClose();
        } catch (err) {
            console.error(err);
            alert('Error submitting report.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', padding: '20px', border: '2px solid var(--forum-border-dark)', width: '400px' }}>
                <h3 style={{ marginBottom: '10px', fontSize: 'var(--forum-font-size-lg)', borderBottom: '1px solid var(--forum-border-light)', paddingBottom: '5px' }}>
                    [!] Report {itemType}
                </h3>
                <p style={{ fontSize: '11px', color: 'gray', marginBottom: '10px' }}>
                    Help us understand what's wrong with this {itemType.toLowerCase()}.
                </p>
                
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Reason:</label>
                        <select 
                            className="forum-input" 
                            value={reason} 
                            onChange={e => setReason(e.target.value)}
                        >
                            <option value="Spam">Spam</option>
                            <option value="Harassment">Harassment</option>
                            <option value="Inappropriate Content">Inappropriate Content</option>
                            <option value="Hate Speech">Hate Speech</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', marginBottom: '3px' }}>Details (optional):</label>
                        <textarea 
                            className="forum-textarea" 
                            style={{ height: '60px' }} 
                            value={details} 
                            onChange={e => setDetails(e.target.value)}
                            placeholder="Add more context..."
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button type="button" className="forum-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="forum-btn forum-btn-primary" style={{ background: 'red', border: '1px solid darkred' }} disabled={submitting}>
                            {submitting ? 'Reporting...' : 'Submit Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportModal;
