import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import './RevenueChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const NAVY = '#232360';
const ORANGE = '#FFB200';

function getMonthLabel(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleString('default', { month: 'short' });
}

const RevenueChart = ({ data }) => {
  // Chart.js data configuration
  const chartData = {
    labels: data.map(item => getMonthLabel(item.date)),
    datasets: [
      {
        label: 'Views',
        data: data.map(item => item.views),
        borderColor: NAVY,
        backgroundColor: 'rgba(35, 44, 96, 0.1)',
        borderWidth: 3.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: NAVY,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 4,
        fill: false,
      },
      {
        label: 'Engagement',
        data: data.map(item => item.engagement),
        borderColor: ORANGE,
        backgroundColor: 'rgba(255, 178, 0, 0.1)',
        borderWidth: 3.5,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: ORANGE,
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 4,
        fill: false,
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
        displayColors: true,
        callbacks: {
          title: function(context) {
            const dataIndex = context[0].dataIndex;
            return new Date(data[dataIndex].date).toLocaleDateString('en-US', { 
              day: '2-digit', 
              month: 'short', 
              year: 'numeric' 
            });
          },
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString()}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#A0A0B0',
          font: {
            size: 15,
            weight: '600',
          },
        },
      },
      y: {
        grid: {
          color: '#E6E6F0',
          lineWidth: 1.5,
        },
        ticks: {
          color: '#A0A0B0',
          font: {
            size: 15,
            weight: '600',
          },
          callback: function(value) {
            return value.toLocaleString();
          },
        },
        min: 0,
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      point: {
        hoverRadius: 8,
      },
    },
  };

  return (
    <div className="modern-analytics-card">
      <div className="mac-header">
        <span className="mac-title">Views & Engagement</span>
        <div className="mac-legend">
          <span className="mac-dot" style={{ background: NAVY }}></span> Views
          <span className="mac-dot" style={{ background: ORANGE, marginLeft: 18 }}></span> Engagement
        </div>
      </div>
      <div style={{ height: '320px', width: '100%' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

RevenueChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    revenue: PropTypes.number.isRequired,
    campaigns: PropTypes.number.isRequired,
    views: PropTypes.number.isRequired,
    engagement: PropTypes.number.isRequired
  })).isRequired
};

export default RevenueChart; 