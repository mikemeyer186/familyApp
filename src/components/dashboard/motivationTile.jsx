import { useUser } from '../../contexts/userContext';

export default function MotivationTile({ variant }) {
    const { motivationSentence } = useUser();

    return (
        <>
            {variant === 'small' ? (
                <div className="dashboard-tile tile-motivation">
                    <p className="motivation-text">&quot;{motivationSentence}&quot;</p>
                </div>
            ) : (
                <div className="dashboard-tile tile-motivation">
                    <h5 className="tile-title">Motivation</h5>
                    <p className="motivation-text">&quot;{motivationSentence}&quot;</p>
                </div>
            )}
        </>
    );
}
