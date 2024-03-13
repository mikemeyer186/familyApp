export default function Spinner({ children }) {
    return (
        <div className="spinner-container width-full d-flex flex-column justify-content-center align-items-center">
            <div className="spinner-border text-secondary" role="status"></div>
            <div className="text-center mt-3">{children}</div>
        </div>
    );
}
