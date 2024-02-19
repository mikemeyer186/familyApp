export default function AssistantTile({ navigateToPage }) {
    return (
        <>
            <div className="dashboard-tile tile-small" onClick={() => navigateToPage('/app/lists?page=Listen')}>
                <h6>Assistent</h6>
                <img src="/assets/img/assistant.webp" alt="Assistent" />
                <div className="tile-small-content">
                    <span className="small-content-header">ChatGPT</span>
                    <div className="small-content-text">Sprich mit deinem persönlichen Assistenten</div>
                </div>
            </div>
        </>
    );
}
