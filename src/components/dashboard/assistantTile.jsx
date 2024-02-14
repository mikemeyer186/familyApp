export default function AssistantTile({ navigateToPage, variant }) {
    return (
        <>
            {variant === 'small' ? (
                <div className="dashboard-tile tile-small" onClick={() => navigateToPage('/app/lists?page=Listen')}>
                    <h6>Assistent</h6>
                    <img src="/assets/img/listen.jpg" alt="Assistent" />
                    <div className="tile-small-content"></div>
                </div>
            ) : (
                <div className="dashboard-tile" onClick={() => navigateToPage('/app/lists?page=Listen')}>
                    <h5>Assistent</h5>
                </div>
            )}
        </>
    );
}
