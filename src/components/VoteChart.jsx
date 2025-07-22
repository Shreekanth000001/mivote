import React, { useEffect, useRef, useMemo, useState } from 'react';
import Chart from 'chart.js/auto';

// --- Reusable Chart Component ---
// This component encapsulates the logic for a single chart.
const VoteChart = ({ title, chartData }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        if (chartRef.current && chartData) {
            const ctx = chartRef.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'bar', // Bar chart is best for comparing vote counts
                data: {
                    labels: chartData.labels,
                    datasets: [{
                        label: 'Total Votes',
                        data: chartData.data,
                        backgroundColor: [
                            'rgba(59, 130, 246, 0.5)',
                            'rgba(239, 68, 68, 0.5)',
                            'rgba(245, 158, 11, 0.5)',
                            'rgba(16, 185, 129, 0.5)',
                            'rgba(139, 92, 246, 0.5)',
                        ],
                        borderColor: [
                            'rgb(59, 130, 246)',
                            'rgb(239, 68, 68)',
                            'rgb(245, 158, 11)',
                            'rgb(16, 185, 129)',
                            'rgb(139, 92, 246)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false // Hide legend for a cleaner look
                        },
                        title: {
                            display: true,
                            text: title,
                            font: {
                                size: 18,
                                weight: 'bold'
                            },
                            padding: {
                                top: 10,
                                bottom: 20
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Votes'
                            }
                        },
                        x: {
                           title: {
                                display: true,
                                text: 'Candidates'
                            }
                        }
                    }
                }
            });
        }

        // Cleanup function to destroy chart instance on component unmount
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData, title]);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <div className="h-80">
                <canvas ref={chartRef}></canvas>
            </div>
        </div>
    );
};


// --- Main Dashboard Component (graph.jsx) ---
export default function ResultsDashboard() {
    const [candidates, setCandidates] = useState([]);
    const [votes, setVotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            setIsLoading(true);
            setError('');
            try {
                // Fetch both candidates and votes from your backend
                const [candidatesRes, votesRes] = await Promise.all([
                    fetch('http://localhost:3000/candidate/show'),
                    fetch('http://localhost:3000/votes/show')
                ]);

                if (!candidatesRes.ok || !votesRes.ok) {
                    throw new Error('Failed to fetch election data.');
                }

                const candidatesData = await candidatesRes.json();
                const votesData = await votesRes.json();
                
                setCandidates(candidatesData.candidates || []);
                setVotes(votesData || []);

            } catch (err) {
                console.error("Error fetching results:", err);
                setError("Could not load results. Please ensure the server is running and try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchResults();
    }, []);

    // useMemo will only re-calculate the vote counts when the votes data changes
    const voteCounts = useMemo(() => {
        const counts = {};
        for (const vote of votes) {
            counts[vote.candidateid] = (counts[vote.candidateid] || 0) + 1;
        }
        return counts;
    }, [votes]);

    // Helper function to prepare data for a specific category
    const getChartDataForCategory = (category) => {
        const categoryCandidates = candidates.filter(c => c.categorytype === category);
        if (!categoryCandidates.length) {
            return { labels: [], data: [] };
        }
        return {
            labels: categoryCandidates.map(c => c.name),
            data: categoryCandidates.map(c => voteCounts[c._id] || 0)
        };
    };

    if (isLoading) {
        return <div className="text-center p-10 font-semibold text-lg">Loading Election Results...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-600 bg-red-100 rounded-lg max-w-md mx-auto">{error}</div>;
    }

    return (
        <div className="p-4 md:p-8 bg-gray-50">
            <header className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">Election Results</h1>
                <p className="text-lg text-gray-600 mt-2">Live vote counts for each position.</p>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <VoteChart title="President" chartData={getChartDataForCategory('President')} />
                <VoteChart title="Vice President" chartData={getChartDataForCategory('VicePresident')} />
                <VoteChart title="Secretary" chartData={getChartDataForCategory('Secretary')} />
            </div>
        </div>
    );
}
