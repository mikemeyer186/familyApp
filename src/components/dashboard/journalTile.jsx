import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
import { useJournal } from '../../contexts/journalContext';
import months from '../../data/months';

export default function JournalTile({ journalBalances }) {
    const { selectedMonth, selectedYear } = useJournal();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const actualBalance = journalBalances.balances[journalBalances.balances.length - 1];

    /**
     * sets data and options for the chart
     */
    useEffect(() => {
        const data = {
            labels: journalBalances.dates,
            datasets: [
                {
                    label: 'Monat',
                    data: journalBalances.balances,
                    fill: {
                        target: 'origin',
                        above: '#9dde9d',
                        below: '#ff9f9f',
                    },
                    borderColor: 'transparent',
                    tension: 0.2,
                    backgroundColor: 'rgb(13, 110, 253, 0.2)',
                },
            ],
        };
        const options = {
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'rgba(34, 38, 42, 0.6)',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(34, 38, 42, 0.6)',
                    },
                    grid: {
                        color: 'rgba(217, 217, 217, 0.5)',
                    },
                },
                y: {
                    ticks: {
                        color: 'rgba(34, 38, 42, 0.6)',
                    },
                    grid: {
                        color: 'rgba(217, 217, 217, 0.5)',
                    },
                },
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, [journalBalances.dates, journalBalances.balances]);

    return (
        <div className="dashboard-tile tile-journal">
            <h4 className="tile-title">
                <span>Finanzübersicht</span>
                <span className={`tile-title-balance ${actualBalance >= 0 ? 'income' : 'spend'}`}>
                    {actualBalance &&
                        actualBalance.toLocaleString('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        })}
                </span>
            </h4>
            <span className="tile-title-month">
                {months[Number(selectedMonth) - 1]} {selectedYear}
            </span>

            {journalBalances.dates.length > 0 ? (
                <Chart type="line" data={chartData} options={chartOptions} />
            ) : (
                <span className="tile-empty-text">Es wurden noch keine Belege in diesem Monat gebucht</span>
            )}
        </div>
    );
}
