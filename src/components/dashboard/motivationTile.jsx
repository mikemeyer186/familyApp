import { useUser } from '../../contexts/userContext';

export default function MotivationTile() {
    const { motivationSentence } = useUser();

    return (
        <div className="dashboard-tile tile-motivation">
            <p className="motivation-text">&quot;{motivationSentence}&quot;</p>
        </div>
    );
}
