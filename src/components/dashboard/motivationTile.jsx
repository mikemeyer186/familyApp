import { useState } from 'react';
import motivationSentences from '../../data/motivationSayings';

export default function MotivationTile() {
    const [yearDay] = useState(dayOfYear());

    /**
     * calculates the number of current day of the year
     * @returns number of the current day of the year
     */
    function dayOfYear() {
        const date = new Date();
        const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return day;
    }

    return (
        <div className="dashboard-tile tile-motivation">
            <p className="motivation-text">&quot;{motivationSentences[yearDay]}&quot;</p>
        </div>
    );
}
