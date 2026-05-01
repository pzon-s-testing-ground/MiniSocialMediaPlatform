import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserApi, followUserApi, uploadAvatarApi } from '../api/userApi';
import { getPostsByUserApi } from '../api/postApi';
import PostCard from '../components/PostCard';
import { useSelector } from 'react-redux';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../utils/cropImage';

const ProfilePage = () => {
    const { id } = useParams();
    const [profileUser, setProfileUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    
    // Crop states
    const [imageSrc, setImageSrc] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);

    const fileInputRef = useRef(null);
    const { user: currentUser } = useSelector(state => state.auth);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [userRes, postsRes] = await Promise.all([
                    getUserApi(id),
                    getPostsByUserApi(id)
                ]);
                setProfileUser(userRes.data);
                setUserPosts(postsRes.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    const handleFollow = async () => {
        try {
            await followUserApi(id);
            // Refresh profile data
            const res = await getUserApi(id);
            setProfileUser(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleAvatarSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImageSrc(reader.result);
                setShowCropModal(true);
            });
            reader.readAsDataURL(file);
            e.target.value = ''; // Reset input
        }
    };

    const handleSaveCrop = async () => {
        if (!imageSrc || !croppedAreaPixels) return;

        setUploadingAvatar(true);
        try {
            const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const formData = new FormData();
            formData.append('avatar', croppedImageBlob);

            const res = await uploadAvatarApi(formData);
            setProfileUser(res.data);
            setShowCropModal(false);
            setImageSrc(null);
        } catch (err) {
            console.error('Avatar upload failed', err);
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (loading) return <div className="forum-loading">Loading profile...</div>;
    if (!profileUser) return <div className="forum-alert forum-alert-error">User not found</div>;

    const isFollowing = currentUser && profileUser.followers?.includes(currentUser._id || currentUser.id);
    const isSelf = currentUser && (currentUser._id === profileUser._id || currentUser.id === profileUser._id);

    return (
        <div className="forum-wrapper">
            <div className="forum-breadcrumb">
                <Link to="/">Forum Home</Link> <span className="separator">»</span> Viewing Profile: {profileUser.username}
            </div>

            <div className="forum-panel">
                <div className="forum-panel-header">
                    Member Profile
                </div>
                <div className="forum-panel-body">
                    <div className="forum-user-card">
                        <div className="user-avatar-large">
                            {profileUser.avatar ? (
                                <img src={profileUser.avatar.startsWith('http') ? profileUser.avatar : `http://localhost:5000${profileUser.avatar}`} alt="Avatar" />
                            ) : (
                                <span>?</span>
                            )}
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                style={{ display: 'none' }} 
                                accept="image/*" 
                                onChange={handleAvatarSelect}
                            />
                        </div>
                        <div className="user-details">
                            <h2 style={{ color: 'var(--forum-header-dark)', marginBottom: '5px' }}>{profileUser.username}</h2>
                            <p className="text-muted" style={{ marginBottom: '10px' }}>Rank: Member</p>
                            
                            {isSelf ? (
                                <button className="forum-btn forum-btn-sm" onClick={() => fileInputRef.current.click()} style={{ marginBottom: 'var(--forum-gap-md)' }}>
                                    {uploadingAvatar ? 'Uploading...' : 'Upload Avatar'}
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px', marginBottom: 'var(--forum-gap-md)' }}>
                                    <button className="forum-btn forum-btn-sm" onClick={handleFollow}>
                                        {isFollowing ? 'Unfollow' : 'Follow'}
                                    </button>
                                    <Link to={`/messages/${profileUser._id}`} className="forum-btn forum-btn-sm" style={{ textDecoration: 'none' }}>
                                        Send Message
                                    </Link>
                                </div>
                            )}

                            <table className="forum-stats-table">
                                <tbody>
                                    <tr>
                                        <th>Join Date:</th>
                                        <td>{new Date(profileUser.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                    <tr>
                                        <th>Total Threads:</th>
                                        <td>{userPosts.length}</td>
                                    </tr>
                                    <tr>
                                        <th>Followers:</th>
                                        <td>{profileUser.followers?.length || 0}</td>
                                    </tr>
                                    <tr>
                                        <th>Following:</th>
                                        <td>{profileUser.following?.length || 0}</td>
                                    </tr>
                                    <tr>
                                        <th>Biography:</th>
                                        <td>{profileUser.bio || 'No biography available.'}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <div className="forum-panel mt-lg">
                <div className="forum-category-header">
                    Threads by {profileUser.username}
                </div>
                <div>
                    {userPosts.length === 0 ? (
                        <div style={{ padding: 'var(--forum-gap-lg)', textAlign: 'center' }}>This user has not created any threads yet.</div>
                    ) : (
                        userPosts.map(post => (
                            <PostCard key={post._id} post={post} />
                        ))
                    )}
                </div>
            </div>

            {/* Crop Modal */}
            {showCropModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div className="forum-panel" style={{ width: '500px', maxWidth: '90%', margin: 0 }}>
                        <div className="forum-panel-header">Crop Avatar</div>
                        <div className="forum-panel-body" style={{ position: 'relative', height: '300px' }}>
                            <Cropper
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onCropComplete={onCropComplete}
                                onZoomChange={setZoom}
                            />
                        </div>
                        <div className="forum-panel-body" style={{ borderTop: '1px solid var(--forum-border-light)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--forum-gap-md)' }}>
                            <button className="forum-btn" onClick={() => { setShowCropModal(false); setImageSrc(null); }} disabled={uploadingAvatar}>Cancel</button>
                            <button className="forum-btn forum-btn-primary" onClick={handleSaveCrop} disabled={uploadingAvatar}>
                                {uploadingAvatar ? 'Uploading...' : 'Save Avatar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
