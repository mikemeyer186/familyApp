import { useUser } from '../../contexts/userContext';

export default function MotivationTile() {
    const { motivationSentence } = useUser();

    return (
        <>
            <div className="dashboard-tile tile-motivation">
                <h5 className="tile-title">Motivation</h5>
                <p className="motivation-text">&quot;{motivationSentence}&quot;</p>
            </div>
        </>
    );
}
