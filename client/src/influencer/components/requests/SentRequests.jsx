import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Requests.css';

/**
 * Sent Requests Component
 * 
 * Displays collaboration requests sent by the influencer to brands
 * @param {Object} props - Component props
 * @param {number} props.userId - The influencer's user ID
 */
const SentRequests = ({ userId = 16 }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const fetchSentRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5052/api/collaboration-requests?userType=influencer&userId=${userId}&filter=sent`);
      const result = await response.json();

      if (result.success) {
        setRequests(result.data.requests || []);
      } else {
        throw new Error(result.message || 'Failed to fetch sent requests');
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5052/api/collaboration-requests/${requestId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Remove the request from the list
        setRequests(prev => prev.filter(req => req.id !== requestId));
        window.showToast('Request withdrawn successfully', 'success');
      } else {
        throw new Error('Failed to withdraw request');
      }
    } catch (error) {
      console.error('Error withdrawing request:', error);
              window.showToast(`Failed to withdraw request: ${error.message}`, 'error');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      case 'completed':
        return 'status-completed';
      default:
        return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'completed':
        return 'Completed';
      default:
        return 'Pending';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="requests-loading">
        <div className="requests-loading-spinner"></div>
        <p>Loading your sent requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-error">
        <div className="requests-error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchSentRequests} className="requests-retry">
          Try Again
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="requests-empty">
        <div className="requests-empty-icon">📤</div>
        <h3>No sent requests</h3>
        <p>You haven't sent any collaboration requests yet.</p>
        <p>Start by exploring campaigns and applying to them!</p>
      </div>
    );
  }

  return (
    <div className="sent-requests">
      <div className="requests-header">
        <h2>Sent Requests</h2>
        <p>Your collaboration requests sent to brands</p>
      </div>

      <div className="requests-list">
        {requests.map((request) => (
          <div key={request.id} className="request-card">
            <div className="request-card__header">
              <div className="request-card__brand">
                <div className="request-card__brand-info">
                  <h3>{request.campaign?.brand_name || 'Unknown Brand'}</h3>
                  <p className="request-card__campaign-name">
                    {request.campaign?.campaign_name || 'Unknown Campaign'}
                  </p>
                </div>
              </div>
              <div className={`request-card__status ${getStatusColor(request.status)}`}>
                {getStatusText(request.status)}
              </div>
            </div>

            <div className="request-card__details">
              <div className="request-card__detail">
                <span className="request-card__label">Platform:</span>
                <span className="request-card__value">{request.campaign?.platform || 'N/A'}</span>
              </div>
              <div className="request-card__detail">
                <span className="request-card__label">Request Type:</span>
                <span className="request-card__value">
                  {(request.request_type === 'collaboration' || request.request_type === 'campaign_assignment') ? 'Campaign Application' : 'Collaboration'}
                </span>
              </div>
              <div className="request-card__detail">
                <span className="request-card__label">Sent:</span>
                <span className="request-card__value">{formatDate(request.created_at)}</span>
              </div>

            </div>

            <div className="request-card__actions">
              {request.status === 'pending' && (
                <button
                  onClick={() => handleWithdraw(request.id)}
                  className="request-card__withdraw-btn"
                >
                  Withdraw Request
                </button>
              )}
              {request.status === 'accepted' && (
                <div className="request-card__accepted">
                  <span className="request-card__accepted-icon">✅</span>
                  <span>Your request was accepted!</span>
                </div>
              )}
              {request.status === 'rejected' && (
                <div className="request-card__rejected">
                  <span className="request-card__rejected-icon">❌</span>
                  <span>Your request was not accepted</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentRequests; 