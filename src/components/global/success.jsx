export default function Success({ success, slideOut }) {
    return (
        <div className={`alert alert-success slide-in-alert ${slideOut}`} role="alert">
            {success}
        </div>
    );
}
