export default function Error({ error, slideOut }) {
    return (
        <div className={`alert alert-danger slideIn-alert ${slideOut}`} role="alert">
            {error}
        </div>
    );
}
