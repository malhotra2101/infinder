import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Requests.css';

/**
 * Received Requests Component
 * 
 * Displays collaboration requests received by the influencer from brands
 * @param {Object} props - Component props
 * @param {number} props.userId - The influencer's user ID
 */
const ReceivedRequests = ({ userId = 16 }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  const fetchReceivedRequests = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`http://localhost:5051/api/collaboration-requests?userType=influencer&userId=${userId}&filter=received`);
      const result = await response.json();

      if (result.success) {
        setRequests(result.data.requests || []);
      } else {
        throw new Error(result.message || 'Failed to fetch received requests');
      }
    } catch (error) {
      console.error('Error fetching received requests:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5051/api/collaboration-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' })
      });

      if (response.ok) {
        // Update the request status in the list
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'accepted' } : req
        ));
        window.showToast('Request accepted successfully!', 'success');
        
        // Refresh the data to ensure consistency with backend
        setTimeout(() => {
          fetchReceivedRequests();
        }, 1000);
      } else {
        throw new Error('Failed to accept request');
      }
    } catch (error) {
      console.error('Error accepting request:', error);
              window.showToast(`Failed to accept request: ${error.message}`, 'error');
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5051/api/collaboration-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected' })
      });

      if (response.ok) {
        // Update the request status in the list
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
        window.showToast('Request rejected', 'success');
        
        // Refresh the data to ensure consistency with backend
        setTimeout(() => {
          fetchReceivedRequests();
        }, 1000);
      } else {
        throw new Error('Failed to reject request');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
              window.showToast(`Failed to reject request: ${error.message}`, 'error');
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
        return 'Pending Response';
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
        <p>Loading received requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="requests-error">
        <div className="requests-error-icon">⚠️</div>
        <p>{error}</p>
        <button onClick={fetchReceivedRequests} className="requests-retry">
          Try Again
        </button>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="requests-empty">
        <div className="requests-empty-icon">📥</div>
        <h3>No received requests</h3>
        <p>You haven't received any collaboration requests yet.</p>
        <p>Brands will send you requests when they're interested in working with you!</p>
      </div>
    );
  }

  return (
    <div className="received-requests">
      <div className="requests-header">
        <h2>Received Requests</h2>
        <p>Collaboration requests from brands</p>
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
                  {(request.request_type === 'collaboration' || request.request_type === 'campaign_assignment') ? 'Campaign Invitation' : 'Collaboration'}
                </span>
              </div>
              <div className="request-card__detail">
                <span className="request-card__label">Received:</span>
                <span className="request-card__value">{formatDate(request.created_at)}</span>
              </div>
              {request.message && (
                <div className="request-card__message">
                  <span className="request-card__label">Message:</span>
                  <p>{request.message}</p>
                </div>
              )}
            </div>

            <div className="request-card__actions">
              {request.status === 'pending' && (
                <div className="request-card__action-buttons">
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="request-card__accept-btn"
                  >
                    Accept Request
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="request-card__reject-btn"
                  >
                    Decline Request
                  </button>
                </div>
              )}
              {request.status === 'accepted' && (
                <div className="request-card__accepted">
                  <span className="request-card__accepted-icon">✅</span>
                  <span>You accepted this request</span>
                </div>
              )}
              {request.status === 'rejected' && (
                <div className="request-card__rejected">
                  <span className="request-card__rejected-icon">❌</span>
                  <span>You declined this request</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReceivedRequests; 