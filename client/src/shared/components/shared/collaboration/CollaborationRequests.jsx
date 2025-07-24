import React, { useState, useEffect } from 'react';
import './CollaborationRequests.css';

const CollaborationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [stats, setStats] = useState({
    sent: { total: 0, pending: 0, accepted: 0, rejected: 0, completed: 0 },
    received: { total: 0, pending: 0, accepted: 0, rejected: 0, completed: 0 }
  });

  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5052/api/collaboration-requests?userType=brand&userId=1&filter=${activeTab}`
      );
      const data = await response.json();
      
      if (data.success) {
        setRequests(data.data.requests || []);
      } else {
        console.error('Failed to fetch requests:', data.message);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(
        'http://localhost:5052/api/collaboration-requests/stats?userType=brand&userId=1'
      );
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5052/api/collaboration-requests/${requestId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus })
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh requests and stats
        fetchRequests();
        fetchStats();
        
        if (window.showToast) {
          window.showToast(
            `Request ${newStatus} successfully`,
            'success',
            3000
          );
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating request status:', error);
      if (window.showToast) {
        window.showToast(
          'Failed to update request status',
          'error',
          3000
        );
      }
    }
  };

  const deleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this request?')) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5052/api/collaboration-requests/${requestId}`,
        {
          method: 'DELETE'
        }
      );
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh requests and stats
        fetchRequests();
        fetchStats();
        
        if (window.showToast) {
          window.showToast(
            'Request deleted successfully',
            'success',
            3000
          );
        }
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting request:', error);
      if (window.showToast) {
        window.showToast(
          'Failed to delete request',
          'error',
          3000
        );
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      case 'completed': return 'blue';
      default: return 'gray';
    }
  };

  const getRequestTypeLabel = (type) => {
    switch (type) {
      case 'collaboration': return 'Collaboration';
      case 'campaign_assignment': return 'Campaign Assignment';
      default: return type;
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
      <div className="collaboration-requests">
        <div className="loading">Loading collaboration requests...</div>
      </div>
    );
  }

  return (
    <div className="collaboration-requests">
      <div className="collaboration-header">
        <h2>Collaboration Requests</h2>
        <p>Manage your collaboration requests with influencers</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Sent Requests</h3>
          <div className="stat-numbers">
            <span className="stat-total">{stats.sent.total}</span>
            <div className="stat-breakdown">
              <span className="stat-pending">{stats.sent.pending} pending</span>
              <span className="stat-accepted">{stats.sent.accepted} accepted</span>
              <span className="stat-rejected">{stats.sent.rejected} rejected</span>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <h3>Received Requests</h3>
          <div className="stat-numbers">
            <span className="stat-total">{stats.received.total}</span>
            <div className="stat-breakdown">
              <span className="stat-pending">{stats.received.pending} pending</span>
              <span className="stat-accepted">{stats.received.accepted} accepted</span>
              <span className="stat-rejected">{stats.received.rejected} rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Requests ({stats.sent.total + stats.received.total})
        </button>
        <button
          className={`tab-button ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          Sent ({stats.sent.total})
        </button>
        <button
          className={`tab-button ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          Received ({stats.received.total})
        </button>
      </div>

      {/* Requests List */}
      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="empty-state">
            <p>No collaboration requests found.</p>
            <p>Start by sending requests to influencers from the search page.</p>
          </div>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="request-header">
                <div className="request-info">
                  <h4>{getRequestTypeLabel(request.request_type)}</h4>
                  <span className={`status-badge status-${getStatusColor(request.status)}`}>
                    {request.status}
                  </span>
                  <span className="direction-badge">
                    {request.direction === 'sent' ? 'Sent' : 'Received'}
                  </span>
                </div>
                <div className="request-actions">
                  {request.status === 'pending' && request.direction === 'received' && (
                    <>
                      <button
                        className="action-button accept"
                        onClick={() => updateRequestStatus(request.id, 'accepted')}
                      >
                        Accept
                      </button>
                      <button
                        className="action-button reject"
                        onClick={() => updateRequestStatus(request.id, 'rejected')}
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {request.status === 'accepted' && (
                    <button
                      className="action-button complete"
                      onClick={() => updateRequestStatus(request.id, 'completed')}
                    >
                      Mark Complete
                    </button>
                  )}
                  <button
                    className="action-button delete"
                    onClick={() => deleteRequest(request.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="request-details">
                {request.campaign && (
                  <div className="campaign-info">
                    <strong>Campaign:</strong> {request.campaign.campaign_name}
                    <br />
                    <strong>Brand:</strong> {request.campaign.brand_name}
                    <br />
                    <strong>Platform:</strong> {request.campaign.platform}
                  </div>
                )}
                


                <div className="request-meta">
                  <span>Created: {formatDate(request.created_at)}</span>
                  <span>ID: {request.id}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollaborationRequests; 