export default function LazySpinner() {
    return (
        <div style={{ display: 'flex', gap: '8px', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="spinner-grow" role="status"></div>
            <div className="spinner-grow" role="status"></div>
            <div className="spinner-grow" role="status"></div>
        </div>
    );
}
