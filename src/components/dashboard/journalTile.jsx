import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';

export default function JournalTile({ journalBalances }) {
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
                    tension: 0.1,
                    backgroundColor: 'transparent',
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
                <span>
                    {' '}
                    {actualBalance.toLocaleString('de-DE', {
                        style: 'currency',
                        currency: 'EUR',
                    })}
                </span>
            </h4>

            {journalBalances ? (
                <Chart type="line" data={chartData} options={chartOptions} />
            ) : (
                <span className="tile-empty-text">Es wurden noch keine Belege in diesem Monat gebucht</span>
            )}
        </div>
    );
}
