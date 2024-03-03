import { Chart } from 'primereact/chart';
import { useCallback, useEffect, useState } from 'react';
import { useJournal } from '../../contexts/journalContext';
import months from '../../data/months';

export default function JournalChart() {
    const { isJournalLoaded, selectedMonth, filterDailyBalances } = useJournal();
    const [journalBalances, setJournalBalances] = useState({});
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const actualMonth = months[Number(selectedMonth) - 1];

    /**
     * loads the daily balances for actual month
     */
    const filterJournal = useCallback(
        function filterJournal() {
            if (isJournalLoaded) {
                const dailyBalances = filterDailyBalances();
                setJournalBalances(dailyBalances);
            }
        },
        [filterDailyBalances, isJournalLoaded]
    );

    function setLoadedStatus() {
        setTimeout(() => {
            setIsLoaded(true);
        }, 100);
    }

    /**
     * filters the journal by actual month
     */
    useEffect(() => {
        filterJournal();
    }, [filterJournal]);

    /**
     * sets data and options for the chart
     */
    useEffect(() => {
        setIsLoaded(false);
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
        setLoadedStatus();
    }, [journalBalances.dates, journalBalances.balances, actualMonth]);

    return (
        <div className="journal-tile journal-chart">
            <h3 className="journal-title">Kontostand</h3>
            {isLoaded ? (
                journalBalances.dates.length === 1 ? (
                    <p>Es wurden noch keine Belege gebucht</p>
                ) : (
                    <Chart type="line" data={chartData} options={chartOptions} />
                )
            ) : (
                <p></p>
            )}
        </div>
    );
}
