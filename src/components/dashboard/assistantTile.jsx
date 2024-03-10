export default function AssistantTile({ navigateToPage }) {
    return (
        <>
            <div className="dashboard-tile" onClick={() => navigateToPage('/app/assistant?page=Assistent')}>
                <h6>Assistent</h6>
                <img src="/assets/img/assistant.webp" alt="Assistent" />
                <div className="tile-content">
                    <span className="tile-content-header">Gemini AI</span>
                    <div className="tile-content-body">Dein KI-Assistent unterstützt dich</div>
                </div>
            </div>
        </>
    );
}
