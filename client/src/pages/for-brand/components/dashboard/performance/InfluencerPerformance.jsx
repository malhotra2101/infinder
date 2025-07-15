import React from 'react';
import PropTypes from 'prop-types';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './InfluencerPerformance.css';

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const donutColors = [
  '#232360', // navy
  '#FFB200', // orange
  '#FFB6B6', // pink
  '#A18AFF', // purple
  '#B2C7FF', // light blue
];

const InfluencerPerformance = ({ data }) => {
  // Chart.js doughnut chart data
  const chartData = {
    labels: data.map(item => item.platform),
    datasets: [
      {
        data: data.map(item => item.rate),
        backgroundColor: donutColors.slice(0, data.length),
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#232360',
        bodyColor: '#232360',
        borderColor: '#e0e0e0',
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed}% (${percentage}%)`;
          },
        },
      },
    },
  };

  const total = data.reduce((sum, item) => sum + item.rate, 0);
  const avgEngagement = (total / data.length).toFixed(1);

  return (
    <div className="chart-card influencer-performance">
      <div className="chart-header">
        <h3 className="chart-title">Engagement by Platform</h3>
      </div>
      
      <div className="chart-content">
        <div className="donut-chart-container" style={{ height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '180px', height: '180px', position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
            <div className="donut-center-label">
              <div className="center-value">{avgEngagement}%</div>
              <div className="center-label">Avg</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InfluencerPerformance.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string.isRequired,
    rate: PropTypes.number.isRequired,
    change: PropTypes.number.isRequired
  })).isRequired
};

export default InfluencerPerformance; 