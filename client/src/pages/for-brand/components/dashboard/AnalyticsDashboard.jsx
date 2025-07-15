import React, { useState } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import "./AnalyticsDashboard.css";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const lineData = [
  { month: "Jan", offline: 15, online: 20 },
  { month: "Feb", offline: 22, online: 35 },
  { month: "Mar", offline: 55, online: 50 },
  { month: "Apr", offline: 44, online: 60 },
  { month: "May", offline: 38, online: 58 },
  { month: "Jun", offline: 40, online: 45 },
  { month: "Jul", offline: 60, online: 40 },
];

const pieData = [
  { name: "Offline", value: 240, color: "#232c5c" },
  { name: "Online", value: 120, color: "#ffb547" },
  { name: "Trade", value: 92, color: "#ff8fa3" },
];

const DROPDOWN_OPTIONS = ["Monthly", "Weekly", "Daily"];

export default function AnalyticsDashboard() {
  const [dropdown, setDropdown] = useState(DROPDOWN_OPTIONS[0]);

  // Chart.js line chart data
  const lineChartData = {
    labels: lineData.map(item => item.month),
    datasets: [
      {
        label: "Offline orders",
        data: lineData.map(item => item.offline),
        borderColor: "#232c5c",
        backgroundColor: "rgba(35, 44, 92, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#232c5c",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
      {
        label: "Online orders",
        data: lineData.map(item => item.online),
        borderColor: "#ffb547",
        backgroundColor: "rgba(255, 181, 71, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 8,
        pointHoverBackgroundColor: "#ffb547",
        pointHoverBorderColor: "#fff",
        pointHoverBorderWidth: 2,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#232c5c",
        bodyColor: "#232c5c",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
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
          color: "#888",
          font: {
            size: 14,
            weight: "500",
          },
        },
      },
      y: {
        grid: {
          color: "#E6E6F0",
          lineWidth: 1.5,
        },
        ticks: {
          color: "#888",
          font: {
            size: 14,
            weight: "500",
          },
          callback: function(value) {
            return `$${value.toLocaleString()}`;
          },
        },
        min: 0,
        max: 100,
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  };

  // Chart.js doughnut chart data
  const doughnutData = {
    labels: pieData.map(item => item.name),
    datasets: [
      {
        data: pieData.map(item => item.value),
        backgroundColor: pieData.map(item => item.color),
        borderWidth: 0,
        cutout: "70%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#232c5c",
        bodyColor: "#232c5c",
        borderColor: "#e0e0e0",
        borderWidth: 1,
        cornerRadius: 12,
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="dashboard-analytics-container">
      <div className="orders-analytics-card">
        <div className="card-header">
          <h2>Orders Analytics</h2>
          <div className="legend-dropdown-row">
            <div className="legend-group">
              <span className="legend-dot offline" /> Offline orders
              <span className="legend-dot online" /> Online orders
            </div>
            <select
              className="dropdown-select"
              value={dropdown}
              onChange={e => setDropdown(e.target.value)}
            >
              {DROPDOWN_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ height: "300px" }}>
          <Line data={lineChartData} options={lineChartOptions} />
        </div>
      </div>
      <div className="earnings-card">
        <div className="card-header">
          <h2>Earnings</h2>
        </div>
        <div className="donut-chart-wrapper">
          <div style={{ width: "220px", height: "220px", position: "relative" }}>
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="earnings-center-label">$452</div>
          </div>
        </div>
        <div className="earnings-legend-row">
          <span className="legend-dot offline" /> Offline
          <span className="legend-dot online" /> Online
          <span className="legend-dot trade" /> Trade
        </div>
      </div>
    </div>
  );
} 