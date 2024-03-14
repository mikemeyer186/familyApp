import { Chart } from 'primereact/chart';
import { useEffect, useMemo, useState } from 'react';
import { useJournal } from '../../contexts/journalContext';
import months from '../../data/months';

export default function JournalChart() {
    const { activePayment, selectedMonth, filterDailyBalances } = useJournal();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const actualMonth = months[Number(selectedMonth) - 1];
    const journalBalances = useMemo(() => filterDailyBalances(), [filterDailyBalances]);

    /**
     * set loaded status of chart after timeout of 100ms
     * smoothes switching between months
     */
    function setLoadedStatus() {
        setTimeout(() => {
            setIsLoaded(true);
        }, 100);
    }

    /**
     * sets data and options for the chart
     */
    useEffect(() => {
        setIsLoaded(false);
        const data = {
            labels: activePayment.length > 0 ? journalBalances.dates : ['', '01', '05', '10', '20', '28'],
            datasets: [
                {
                    label: actualMonth,
                    data: activePayment.length > 0 ? journalBalances.balances : [0, 1200, 1300, 400, -300, 200],
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
    }, [journalBalances, actualMonth, activePayment]);

    return (
        <div className="journal-chart">
            <h3 className="journal-title">Kontostand</h3>
            {isLoaded && <Chart type="line" data={chartData} options={chartOptions} />}
            {activePayment.length === 0 && (
                <div className="chart-example">
                    <div>Es wurden noch keine Belege gebucht</div>
                </div>
            )}
        </div>
    );
}
