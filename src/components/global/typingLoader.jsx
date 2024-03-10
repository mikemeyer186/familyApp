export default function TypingLoader() {
    return (
        <div style={{ display: 'flex', gap: '8px' }}>
            <div className="spinner-grow ls-1" role="status"></div>
            <div className="spinner-grow ls-2" role="status"></div>
            <div className="spinner-grow ls-3" role="status"></div>
        </div>
    );
}
