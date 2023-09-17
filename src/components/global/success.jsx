export default function Success({ success, slideOut }) {
    return (
        <div className={`alert alert-success slideIn-alert ${slideOut}`} role="alert">
            {success}
        </div>
    );
}
