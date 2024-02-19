export default function AssistantTile({ navigateToPage }) {
    return (
        <>
            <div className="dashboard-tile" onClick={() => navigateToPage('/app/lists?page=Listen')}>
                <h6>Assistent</h6>
                <img src="/assets/img/assistant.webp" alt="Assistent" />
                <div className="tile-content">
                    <span className="tile-content-header">ChatGPT</span>
                    <div className="tile-content-body">Sprich mit deinem persönlichen Assistenten</div>
                </div>
            </div>
        </>
    );
}
