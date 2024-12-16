import React, { useState, useEffect } from "react";
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from "axios";
import './Homepage.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

function DashboardSummary() {
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
                    <h3>{summary.totalEstimateAmount.toFixed(2)}</h3>
                </div>
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
                    <h3>{summary.totalSalesAmount.toFixed(2)}</h3>
                </div>
            </div>
          </div>
          <div className="section">
            <h2 className="chart-title">Total Amount Breakdown</h2>
            <div className="chart-container">
                <Pie
                data={{
                    labels: ['Estimate Total Amount', 'Sales Total Amount'],
                    datasets: [
                    {
                        label: 'Amount',
                        data: [summary.totalEstimateAmount || 60, summary.totalSalesAmount || 40],
                        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
                        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
                        borderWidth: 1,
                    },
                    ],
                }}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            enabled: true,
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
                    // Apply shadow and hover effects
                    beforeDraw: (chart) => {
                        const ctx = chart.ctx;
                        ctx.save();
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
                        ctx.shadowBlur = 80;
                        ctx.shadowOffsetX = 5;
                        ctx.shadowOffsetY = 5;
                    },
                    afterDraw: (chart) => {
                        chart.ctx.restore();
                    },
                }}
                />
            </div>
          </div>

        </div>

        
        
      );
    };

export default DashboardSummary;