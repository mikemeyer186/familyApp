import { Chart } from 'primereact/chart';
import { useEffect, useState } from 'react';
import { useJournal } from '../../contexts/journalContext';
import months from '../../data/months';

export default function JournalTile({ journalBalances, navigateToPage, variant }) {
    const { selectedMonth, selectedYear, activePayment } = useJournal();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const actualBalance = journalBalances.balances[journalBalances.balances.length - 1];
    const actualMonth = months[Number(selectedMonth) - 1];

    /**
     * sets data and options for the chart
     */
    useEffect(() => {
        const data = {
            labels: journalBalances.dates,
            datasets: [
                {
                    label: actualMonth,
                    data: journalBalances.balances,
                    fill: {
                        target: 'origin',
                        above: 'rgba(111, 224, 135, 0.7)',
                        below: 'rgba(255, 108, 108, 0.6)',
                    },
                    borderColor: 'transparent',
                    tension: 0.2,
                    backgroundColor: 'transparent',
                },
            ],
        };
        const options = {
            animation: {
                duration: 1000,
                easing: 'easeOutCubic',
                loop: false,
            },
            maintainAspectRatio: false,
            aspectRatio: 1.5,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: 'rgba(34, 38, 42, 0.3)',
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: 'rgba(34, 38, 42, 0.4)',
                    },
                    grid: {
                        color: 'rgba(217, 217, 217, 0.3)',
                    },
                },
                y: {
                    ticks: {
                        color: 'rgba(34, 38, 42, 0.4)',
                    },
                    grid: {
                        color: 'rgba(217, 217, 217, 0.3)',
                    },
                },
            },
        };

        setChartData(data);
        setChartOptions(options);
    }, [journalBalances.dates, journalBalances.balances, actualMonth]);

    return (
        <>
            {variant === 'small' ? (
                <div className="dashboard-tile tile-journal tile-small" onClick={() => navigateToPage('/app/journal?page=Journal')}>
                    <h6>Finanzen</h6>
                    <img src="/assets/img/journal.webp" alt="Journal" />
                    <div className="tile-small-content">
                        <span className="small-content-header">
                            {actualMonth} {selectedYear}
                        </span>
                        <div className="journal-small-content">
                            {journalBalances.dates.length > 0 ? (
                                <>
                                    <div>
                                        <span>Kontostand: </span>
                                        <span className={`tile-title-balance ${actualBalance >= 0 ? 'income' : 'spend'}`}>
                                            {actualBalance.toLocaleString('de-DE', {
                                                style: 'currency',
                                                currency: 'EUR',
                                            })}
                                        </span>
                                    </div>
                                    <div>
                                        <span>Belege gebucht: </span>
                                        <span className="journal-small-content-number">{activePayment ? activePayment.length : 0}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="tile-empty-text">Noch keine Belege in diesem Monat gebucht</div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="dashboard-tile tile-journal" onClick={() => navigateToPage('/app/journal?page=Journal')}>
                    <h5 className="tile-title">
                        <span>Finanzen</span>
                        <span className={`tile-title-balance ${actualBalance >= 0 ? 'income' : 'spend'}`}>
                            {actualBalance &&
                                actualBalance.toLocaleString('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                })}
                        </span>
                    </h5>
                    <span className="tile-title-month">
                        {actualMonth} {selectedYear}
                    </span>

                    {journalBalances.dates.length > 0 ? (
                        <Chart type="line" data={chartData} options={chartOptions} />
                    ) : (
                        <div className="tile-empty-text">Es wurden noch keine Belege in diesem Monat gebucht</div>
                    )}
                </div>
            )}
        </>
    );
}
