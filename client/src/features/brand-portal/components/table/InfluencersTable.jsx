import React, { useState, useEffect, useCallback } from 'react';
import { getInfluencersByListType } from '../../../../shared/services/backendApi.js';
import './InfluencersTable.css';

const statusColors = {
  ACTIVE: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' },
  BAN: { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' },
  VERIFICATION: { bg: '#fefce8', text: '#ca8a04', border: '#fde047' },
  PROGRESS: { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' },
  DELETE: { bg: '#f3f4f6', text: '#6b7280', border: '#d1d5db' }
};

const levelColors = {
  SENIOR: { bg: '#f3e8ff', text: '#7c3aed', border: '#c4b5fd' },
  MIDDLE: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  JUNIOR: { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' }
};

const InfluencersTable = () => {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch selected influencers from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: page.toString(),
          limit: rowsPerPage.toString()
        });
        
        if (debouncedSearch.trim()) {
          params.append('search', debouncedSearch.trim());
        }
        
        const response = await getInfluencersByListType('selected', params.toString());
        
        if (response.success) {
          setData(response.data.data || []);
          setTotalCount(response.data.pagination?.total || 0);
          setTotalPages(response.data.pagination?.totalPages || 0);
        } else {
          throw new Error(response.message || 'Failed to fetch selected influencers');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching selected influencers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedSearch, page, rowsPerPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num?.toString() || '0';
  };

  return (
    <div className="table-container">
      {/* Table Card */}
      <div className="table-card">
        {/* Header */}
        <div className="table-header">
          <h3>Selected Influencers</h3>
          <p>Manage your selected influencers for campaigns</p>
        </div>

        {/* Search */}
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search influencers by name, bio, or category"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {debouncedSearch && (
              <div className="search-status">
                Searching for: "{debouncedSearch}"
              </div>
            )}
            {search && (
              <button
                className="clear-search-btn"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Influencer</th>
                <th>Platform</th>
                <th>Followers</th>
                <th>Engagement Rate</th>
                <th>Category</th>
                <th>Country</th>
                <th>Age Group</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="loading-cell">
                    <div className="loading-spinner"></div>
                    <span>Loading selected influencers...</span>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="10" className="error-cell">
                    <span>Error: {error}</span>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="10" className="empty-cell">
                    <span>No selected influencers found</span>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                <tr key={item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td className="user-cell">
                    <div className="user-info">
                      <img 
                        src={item.avatar || `https://ui-avatars.com/api/?name=${item.name}&background=6366f1&color=fff&size=32`} 
                        alt={item.name}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${item.name}&background=6366f1&color=fff&size=32`;
                        }}
                      />
                      <div className="user-details">
                        <div className="user-name">{item.name}</div>
                        <div className="user-bio">{item.bio || 'No bio available'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="platform-cell">
                    <span className="platform-tag">{item.platform || 'Unknown'}</span>
                  </td>
                  <td className="followers-cell">{formatNumber(item.followers)}</td>
                  <td className="engagement-cell">
                    <span className="engagement-rate">{(item.engagement_rate || 0).toFixed(2)}%</span>
                  </td>
                  <td className="category-cell">
                    <span className="category-tag">{item.category || 'General'}</span>
                  </td>
                  <td className="country-cell">{item.country || 'Unknown'}</td>
                  <td className="age-cell">{item.age_group || 'N/A'}</td>
                  <td className="last-active-cell">
                    {item.last_active ? new Date(item.last_active).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="actions-cell">
                    <button
                      className="actions-btn"
                      onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                    >
                      ⋮
                    </button>
                    {showMenu === item.id && (
                      <div className="actions-menu">
                        <div className="action-item">View Details</div>
                        <div className="action-item">Remove from Selected</div>
                        <div className="action-item">Add to Campaign</div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="table-footer">
          <div className="pagination-info">
            <span>Total {totalCount} selected influencers</span>
          </div>
          <div className="pagination-controls">
            <div className="rows-per-page">
              <span>Rows per page:</span>
              <select 
                value={rowsPerPage} 
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="rows-select"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="page-controls">
              <button 
                className="page-btn"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                ‹
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`page-btn ${page === pageNum ? 'active' : ''}`}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  {totalPages > 6 && <span className="page-ellipsis">...</span>}
                  <button
                    className="page-btn"
                    onClick={() => setPage(totalPages)}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button 
                className="page-btn"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencersTable; 