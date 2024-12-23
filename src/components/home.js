import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Homepage.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardSummary() {

    const navigate = useNavigate(); 

    const [summary, setSummary] = useState({
        totalEstimates: 0,
        totalEstimateAmount: 0,
        totalSales: 0,
        totalSalesAmount: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const estimatesResponse = await axios.get("https://estimate-invoice-backend.vercel.app/api/estimates/summary");
                const salesResponse = await axios.get("https://estimate-invoice-backend.vercel.app/api/invoices/summary");
                setSummary({
                    totalEstimates: estimatesResponse.data.totalEstimates,
                    totalEstimateAmount: estimatesResponse.data.totalAmount,
                    totalSales: salesResponse.data.totalSales,
                    totalSalesAmount: salesResponse.data.totalAmount,
                });
            } catch (error) {
                console.error("Error fetching summary:", error);
            }
        };
        fetchData();
    }, []);

    const handleViewEstimates = () => {
        navigate('/allestimates'); // Navigate to Estimates page
    };

    const handleViewSales = () => {
        navigate('/allsales'); // Navigate to Sales page
    };

    const chartData = {
        labels: ['Estimate Total Amount', 'Sales Total Amount'],
        datasets: [
            {
                label: 'Amount',
                data: [summary.totalEstimateAmount || 40, summary.totalSalesAmount || 60],
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const { ctx, chartArea } = chart;
                    if (!chartArea) return null; // If the chart is not ready
                    return createGradientColors(ctx, chartArea);
                },
                borderColor: ['rgb(14, 105, 72)', 'rgb(160, 21, 160)'],
                borderWidth: 1,
                hoverOffset: 12, // Pops out the hovered slice
            },
        ],
    };

    // Function to create gradients
    const createGradientColors = (ctx, chartArea) => {
        const width = chartArea.right - chartArea.left;
        const height = chartArea.bottom - chartArea.top;

        const gradient1 = ctx.createLinearGradient(0, 0, width, height);
        gradient1.addColorStop(0, '#43cea2');
        gradient1.addColorStop(1, '#185b9d73');

        const gradient2 = ctx.createLinearGradient(0, 0, width, height);
        gradient2.addColorStop(0, '#ff6fd8');
        gradient2.addColorStop(1, '#845ec287');

        return [gradient1, gradient2];
    };

    return (
        <div className="dashboard">
            <h1 className="dashboard-title">Summary Dashboard</h1>

            {/* Estimates Section */}
            <div className="section">
                <div className="glass-box">
                    <div className="arrow-box green">
                        <h2>ESTIMATE:</h2>
                    </div>
                    <div className="glass-card green1">
                        <p>Total No. of Estimates:</p>
                        <h3>{summary.totalEstimates}</h3>
                    </div>
                    <div className="glass-card green2">
                        <p>Total Amount</p>
                        <h3>₹{summary.totalEstimateAmount.toFixed(2)}</h3>
                    </div>
                    <button className="glass-card green3" onClick={handleViewEstimates}>
                        <p>View All Estimates...</p>                   
                    </button>
                </div>
            </div>

            {/* Sales Section */}
            <div className="section">
                <div className="glass-box">
                    <div className="arrow-box purple">
                        <h2>SALES:</h2>
                    </div>
                    <div className="glass-card purple1">
                        <p>Total No. of Sales:</p>
                        <h3>{summary.totalSales}</h3>
                    </div>
                    <div className="glass-card purple2">
                        <p>Total Amount:</p>
                        <h3>₹{summary.totalSalesAmount.toFixed(2)}</h3>
                    </div>
                    <button className="glass-card purple3" onClick={handleViewSales}>
                        <p>View All Sales...</p>                   
                    </button>
                </div>
            </div>

            {/* Pie Chart Section */}
            <div className="section">
                <h2 className="chart-title">Total Amount Breakdown</h2>
                <div className="glass-box2">
                    <Pie
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                tooltip: {
                                    enabled: true,
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                    titleFont: {
                                        size: 16,
                                        weight: 'bold',
                                    },
                                    bodyFont: {
                                        size: 14,
                                    },
                                    bodyColor: '#ffffff',
                                    cornerRadius: 8,
                                    displayColors: false,
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            return `${tooltipItem.label}: $${tooltipItem.raw.toFixed(2)}`;
                                        },
                                    },
                                },
                            },
                            hover: {
                                mode: 'nearest',
                                onHover: (event, chartElement) => {
                                    event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
                                },
                            },
                            animation: {
                                animateScale: true,
                                animateRotate: true,
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default DashboardSummary;
