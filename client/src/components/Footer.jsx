const Footer = () => {
    return (
        <div className="forum-footer">
            <div>Powered by MiniForum Engine &copy; 2026</div>
            <div style={{ marginTop: 'var(--forum-gap-sm)', fontSize: 'var(--forum-font-size-sm)', color: 'var(--forum-text-muted)' }}>
                All times are GMT. The time now is {new Date().toLocaleTimeString()}.
            </div>
        </div>
    );
};

export default Footer;
