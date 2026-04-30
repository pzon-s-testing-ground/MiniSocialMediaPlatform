import { useSelector } from 'react-redux';

const Sidebar = () => {
    const { posts } = useSelector((state) => state.posts);

    return (
        <div className="forum-sidebar-panel">
            <h3 style={{ borderBottom: '1px solid var(--forum-border-light)', paddingBottom: 'var(--forum-gap-sm)' }}>Forum Stats</h3>
            <div style={{ fontSize: 'var(--forum-font-size-sm)', lineHeight: '1.8' }}>
                <div><strong>Total Threads:</strong> {posts.length}</div>
                <div><strong>Total Posts:</strong> {posts.reduce((acc, p) => acc + (p.comments?.length || 0) + 1, 0)}</div>
                <div style={{ marginTop: 'var(--forum-gap-md)' }}>
                    <strong>Currently Active:</strong><br />
                    1 Members, 0 Guests
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
