const ForumHeader = () => {
    return (
        <div style={{ background: 'var(--forum-header-dark)', padding: 'var(--forum-gap-xl)', textAlign: 'center' }}>
            <h1 style={{ color: 'var(--forum-accent)', margin: 0, fontSize: '36px', letterSpacing: '2px' }}>MiniForum 2000</h1>
            <p style={{ color: 'var(--forum-text-white)', margin: 'var(--forum-gap-sm) 0 0' }}>The premier retro discussion board</p>
        </div>
    );
};

export default ForumHeader;
