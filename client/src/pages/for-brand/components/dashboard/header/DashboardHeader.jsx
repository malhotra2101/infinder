import React from 'react';
import PropTypes from 'prop-types';
import './DashboardHeader.css';

const DashboardHeader = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="dashboard-title">
            CRM Dashboard
          </h1>
          <p className="dashboard-subtitle">Influencer Marketing Analytics & Insights</p>
        </div>
        
        <div className="header-right">
          <div className="date-range-container">
            <span className="date-range-label">Show data from</span>
            <input 
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="date-input"
            />
            <span className="date-range-label">to</span>
            <input 
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="date-input"
            />
          </div>
          
          <div className="header-actions">
            <button className="btn btn-secondary">
              Export Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardHeader.propTypes = {
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onStartDateChange: PropTypes.func.isRequired,
  onEndDateChange: PropTypes.func.isRequired
};

export default DashboardHeader; 