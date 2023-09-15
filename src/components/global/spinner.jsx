export default function Spinner() {
    return (
        <div className="spinner-container d-flex justify-content-center align-items-center">
            <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
}
