import { useNavigate } from 'react-router';

export default function AssistantTile() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-tile" onClick={() => navigate('/app/assistant?page=Assistent')}>
            <h6>Assistent</h6>
            <img src="/assets/img/assistant.webp" alt="Assistent" />
            <div className="tile-content">
                <span className="tile-content-header">Gemini AI</span>
                <div className="tile-content-body">Dein KI-Assistent unterstützt dich</div>
            </div>
        </div>
    );
}
