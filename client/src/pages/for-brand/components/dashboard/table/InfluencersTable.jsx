import React, { useState, useEffect } from 'react';
import { getInfluencersTable, updateInfluencerStatus, deleteInfluencer } from '../../../services/dashboardApi';
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
  const [showMenu, setShowMenu] = useState(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState(null);

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getInfluencersTable({
          search,
          page,
          rowsPerPage
        });
        setData(result.data);
        setTotalCount(result.count);
        setTotalPages(result.totalPages);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching influencers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, page, rowsPerPage]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="table-container">
      {/* Table Card */}
      <div className="table-card">
        {/* Search */}
        <div className="table-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Balance</th>
                <th>Level</th>
                <th>Backlog</th>
                <th>In progress</th>
                <th>Done</th>
                <th>User status</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="loading-cell">
                    <div className="loading-spinner"></div>
                    <span>Loading influencers...</span>
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
                    <span>No influencers found</span>
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                <tr key={item.id}>
                  <td className="id-cell">{item.id}</td>
                  <td className="user-cell">
                    <div className="user-info">
                      <img 
                        src={item.user.avatar} 
                        alt={item.user.name}
                        className="user-avatar"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${item.user.name}&background=6366f1&color=fff&size=32`;
                        }}
                      />
                      <div className="user-details">
                        <div className="user-name">{item.user.name}</div>
                        <div className="user-email">{item.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="balance-cell">{formatCurrency(item.balance)}</td>
                  <td className="level-cell">
                    <span 
                      className="level-tag"
                      style={{
                        backgroundColor: levelColors[item.level].bg,
                        color: levelColors[item.level].text,
                        borderColor: levelColors[item.level].border
                      }}
                    >
                      {item.level}
                    </span>
                  </td>
                  <td className="backlog-cell">{item.backlog}</td>
                  <td className="progress-cell">{item.inProgress}</td>
                  <td className="done-cell">{item.done}</td>
                  <td className="status-cell">
                    <span 
                      className="status-tag"
                      style={{
                        backgroundColor: statusColors[item.status].bg,
                        color: statusColors[item.status].text,
                        borderColor: statusColors[item.status].border
                      }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="created-cell">{item.created}</td>
                  <td className="actions-cell">
                    <button
                      className="actions-btn"
                      onClick={() => setShowMenu(showMenu === item.id ? null : item.id)}
                    >
                      ⋮
                    </button>
                    {showMenu === item.id && (
                      <div className="actions-menu">
                        <div className="action-item">Edit</div>
                        <div className="action-item">Delete</div>
                        <div className="action-item">View Details</div>
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
            <span>Total {totalCount}</span>
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