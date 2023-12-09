import { useState } from 'react';
import motivationSentences from '../../data/motivationSayings';

export default function DashboardPage() {
    const date = new Date();
    const [yearDay] = useState(dayOfYear());

    function dayOfYear() {
        const day = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        return day;
    }
    return (
        <>
            <h1>Dashboard</h1>
            <p className="motivation-text">{motivationSentences[yearDay]}</p>
        </>
    );
}
