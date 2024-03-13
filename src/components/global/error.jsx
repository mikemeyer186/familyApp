export default function Error({ error, slideOut }) {
    return (
        <div className={`alert alert-danger slide-in-alert ${slideOut}`} role="alert">
            {error}
        </div>
    );
}
