import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '../../shared/utils/useDebounce.js';
import { useCollaborationUpdates, useConnectionStatus } from '../../shared/hooks/useRealtime.js';
import { searchInfluencers, getInfluencersByListType, addToList, removeFromList, getCollaborationRequests } from '../../shared/services/backendApi.js';
import Header from '../components/header/Header';
import SearchBar from '../components/search-bar/SearchBar';
import FilterSidebar from '../components/filter-sidebar/FilterSidebar';
import InfluencerCard from '../components/influencer-card/InfluencerCard';
import CampaignSelectionModal from '../components/campaign-selection-modal/CampaignSelectionModal';
import ViewDetailsModal from '../components/influencer-card/ViewDetailsModal';
import RemoveModal from '../components/influencer-card/RemoveModal';
import WithdrawModal from '../components/influencer-card/WithdrawModal';
import NotificationSidebar from '../../shared/components/shared/notification/NotificationSidebar';
import './SearchPage.css';

/**
 * Enhanced Search Page Component
 * 
 * Main search page with advanced filtering, infinite scroll, and real-time updates.
 * Features modern UI with smooth animations and responsive design.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.sidebarOpen - Whether sidebar is open
 * @returns {JSX.Element} Search page component
 */
const SearchPage = ({ sidebarOpen = false }) => {
  // State management
  const [influencers, setInfluencers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platforms: [],
    followerRanges: [],
    engagementRanges: [],
    contentCategories: [],
    ageGroups: [],
    genders: [],
    countries: [],
    collaborationStatus: 'none',
    minFollowers: null,
    maxFollowers: null,
    minEngagement: null,
    maxEngagement: null,
    lastActive: null
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [refreshCounts, setRefreshCounts] = useState(0);
  const [collaborationStatus, setCollaborationStatus] = useState({});
  
  // Modal state
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  
  // View Details Modal state
  const [showViewDetailsModal, setShowViewDetailsModal] = useState(false);
  const [viewDetailsInfluencer, setViewDetailsInfluencer] = useState(null);
  
  // Remove Modal state
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [removeInfluencer, setRemoveInfluencer] = useState(null);
  
  // Withdraw Modal state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawInfluencer, setWithdrawInfluencer] = useState(null);
  
  // Request toggle state
  const [requestType, setRequestType] = useState('sent'); // 'sent' or 'received'

  // Real-time updates
  const { lastUpdate: collaborationUpdate, isConnected: collaborationConnected } = useCollaborationUpdates();
  const connectionStatus = useConnectionStatus();

  // Debounced search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /**
   * Fetch collaboration status for influencers (optimized with caching)
   * @param {Array} influencerIds - Array of influencer IDs
   */
  const fetchCollaborationStatus = useCallback(async (influencerIds) => {
    if (!influencerIds || influencerIds.length === 0) return;

    // Skip if we're not on the 'all' tab
    if (activeTab !== 'all') return;



    try {
      const statusMap = {};
      
      // Use a single API call to get all collaboration requests for the brand
      const response = await fetch(`http://localhost:5052/api/collaboration-requests?userType=brand&userId=1&filter=sent`);
      const result = await response.json();
      
      if (result.success && result.data.requests) {
        const requests = result.data.requests || [];
        
        // Create a map of influencer IDs to their most recent request
        const influencerRequestMap = {};
        
        requests.forEach(request => {
          const influencerId = request.receiver_id;
          const requestStatus = request.status;
          
          // Only consider pending or accepted requests
          if (requestStatus === 'pending' || requestStatus === 'accepted') {
            // If we haven't seen this influencer yet, or if this request is more recent
            if (!influencerRequestMap[influencerId] || 
                new Date(request.created_at) > new Date(influencerRequestMap[influencerId].created_at)) {
              influencerRequestMap[influencerId] = request;
            }
          }
        });
        
        // Now check which of our influencer IDs have requests
        influencerIds.forEach(influencerId => {
          const request = influencerRequestMap[influencerId];
          if (request) {
            statusMap[influencerId] = {
              status: request.status,
              requestType: request.request_type,
              campaignName: request.campaign?.campaign_name || 'General Collaboration'
            };

          }
        });
      }
      

      setCollaborationStatus(statusMap);
    } catch (error) {
      console.error('Error fetching collaboration status:', error);
    }
  }, [activeTab]);

  // Fetch influencers function
  const fetchInfluencers = useCallback(async (isNewSearch = false, tabOverride = null) => {

    try {
      setLoading(true);
      setError(null);

      const tab = tabOverride || activeTab;

      
      if (tab === 'requests') {
        // Fetch collaboration requests from the collaboration_requests table
        try {
          const response = await fetch(`http://localhost:5052/api/collaboration-requests?userType=brand&userId=1&filter=${requestType}`);
          const result = await response.json();
          
          if (result.success) {
            const requests = result.data.requests || [];
            const requestInfluencers = [];
            
            // Create a separate card for each request (not grouped by influencer)
            for (const request of requests) {
              let influencerId;
              
              if (requestType === 'sent') {
                // For sent requests, get the receiver (influencer) details
                influencerId = request.receiver_id;
              } else {
                // For received requests, get the sender (influencer) details
                influencerId = request.sender_id;
              }
              
              try {
                // Fetch influencer details
                const influencerResponse = await fetch(`http://localhost:5052/api/influencers/${influencerId}`);
                const influencerResult = await influencerResponse.json();
                
                if (influencerResult.success) {
                  const influencer = influencerResult.data;
                  
                  // Create a separate card for each request
                  requestInfluencers.push({
                    ...influencer,
                    // Add request-specific data for this specific request
                    request_id: request.id,
                    request_type: request.request_type,
                    request_status: request.status,
                    request_direction: request.direction,
                    campaign: request.campaign,
                    sender_id: request.sender_id,
                    receiver_id: request.receiver_id,
                    created_at: request.created_at,
                    message: request.message,
                    // Add this single request to all_requests array
                    all_requests: [request]
                  });
                }
              } catch (error) {
                console.error(`Error fetching influencer details for influencer ${influencerId}:`, error);
              }
            }
            
            setInfluencers(requestInfluencers);
            setHasMore(false);
            setPage(1);
          } else {
            console.error('Failed to fetch collaboration requests:', result.message);
            setInfluencers([]);
            setHasMore(false);
          }
        } catch (apiError) {
          console.error('Error fetching collaboration requests:', apiError);
          setInfluencers([]);
          setHasMore(false);
        }
      } else if (tab === 'selected') {
        // Fetch selected influencers
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 20);
        
        const response = await fetch(`http://localhost:5052/api/influencers/lists/selected?${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
          const newInfluencers = result.data.data || [];

          
          if (isNewSearch) {
            setInfluencers(newInfluencers);
            setPage(1);
          } else {
            setInfluencers(prev => [...prev, ...newInfluencers]);
          }
          
          setHasMore(result.data.pagination?.hasMore || newInfluencers.length === 20);
        } else {
          throw new Error(result.message || 'Failed to fetch selected influencers');
        }
      } else {
        // Fetch all influencers (for 'all' tab)
        const params = new URLSearchParams();
        params.append('page', page);
        params.append('limit', 20);
        
        if (debouncedSearchTerm) {
          params.append('search', debouncedSearchTerm);
        }
        
        // Add filters
        if (filters.platforms.length > 0) {
          params.append('platform', filters.platforms[0]);
        }
        if (filters.minFollowers) {
          params.append('minFollowers', filters.minFollowers.toString());
        }
        if (filters.maxFollowers) {
          params.append('maxFollowers', filters.maxFollowers.toString());
        }
        if (filters.minEngagement) {
          params.append('minEngagement', filters.minEngagement.toString());
        }
        if (filters.maxEngagement) {
          params.append('maxEngagement', filters.maxEngagement.toString());
        }
        if (filters.country) {
          params.append('country', filters.country);
        }
        if (filters.ageGroups.length > 0) {
          params.append('ageGroup', filters.ageGroups[0]);
        }
        if (filters.lastActive) {
          params.append('lastActive', filters.lastActive);
        }
        
        const response = await fetch(`http://localhost:5052/api/influencers?${params.toString()}`);
        const result = await response.json();
        
        if (result.success) {
          const newInfluencers = result.data.data || [];

          
          if (isNewSearch) {

            setInfluencers(newInfluencers);
            setPage(1);
          } else {

            setInfluencers(prev => [...prev, ...newInfluencers]);
          }
          
          setHasMore(result.data.pagination?.hasMore || newInfluencers.length === 20);
          
          // Fetch collaboration status for influencers in 'all' tab (only on initial load)
          if (newInfluencers.length > 0 && isNewSearch && activeTab === 'all') {
            const influencerIds = newInfluencers.map(inf => inf.id);
            fetchCollaborationStatus(influencerIds);
          }
        } else {
          throw new Error(result.message || 'Failed to fetch influencers');
        }
      }
    } catch (error) {
      console.error('Error fetching influencers:', error);
      setError(error.message);
    } finally {

      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [debouncedSearchTerm, filters, activeTab, page, requestType]);

  // Fetch collaboration status when switching to 'all' tab (with debouncing)
  useEffect(() => {
    if (activeTab === 'all' && influencers.length > 0) {
      const influencerIds = influencers.map(inf => inf.id);
      
      // Debounce the collaboration status fetch
      const timeoutId = setTimeout(() => {
        fetchCollaborationStatus(influencerIds);
      }, 1000); // 1 second debounce
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, influencers.length, fetchCollaborationStatus]);

  // Refetch data when requestType changes (for requests tab)
  useEffect(() => {
    if (activeTab === 'requests') {
      fetchInfluencers(true);
    }
  }, [requestType, activeTab]);

  // Load more function
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Handle search
  const handleSearch = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle filter removal
  const handleFilterRemove = useCallback((filterType, filterValue) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'platform':
          newFilters.platforms = prev.platforms.filter(p => p !== filterValue);
          break;
        case 'followers':
          newFilters.minFollowers = null;
          newFilters.maxFollowers = null;
          break;
        case 'engagement':
          newFilters.minEngagement = null;
          newFilters.maxEngagement = null;
          break;
        case 'contentCategory':
          newFilters.contentCategories = prev.contentCategories.filter(c => c !== filterValue);
          break;
        case 'ageGroup':
          newFilters.ageGroups = prev.ageGroups.filter(ag => ag !== filterValue);
          break;
        case 'gender':
          newFilters.genders = prev.genders.filter(g => g !== filterValue);
          break;
        case 'country':
          newFilters.countries = prev.countries.filter(c => c !== filterValue);
          break;
        case 'collaborationStatus':
          newFilters.collaborationStatus = 'none';
          break;
        case 'lastActive':
          newFilters.lastActive = null;
          break;
        default:
          break;
      }
      
      return newFilters;
    });
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle clear all filters
  const handleClearAll = useCallback(() => {
    setFilters({
      platforms: [],
      followerRanges: [],
      engagementRanges: [],
      contentCategories: [],
      ageGroups: [],
      genders: [],
      countries: [],
      collaborationStatus: 'none',
      minFollowers: null,
      maxFollowers: null,
      minEngagement: null,
      maxEngagement: null,
      lastActive: null
    });
    setPage(1);
    setInfluencers([]);
    setIsInitialLoad(true);
  }, []);

  // Handle card actions
  const handleCardAction = useCallback((action, data) => {

    switch (action) {
      case 'showCampaignModal':
        // Show campaign selection modal
        setSelectedInfluencer(data.influencer);
        setShowCampaignModal(true);
        break;
      case 'viewDetails':
        // Show view details modal
        setViewDetailsInfluencer(data.influencer);
        setShowViewDetailsModal(true);
        break;
      case 'remove':
        // Show remove modal
        setRemoveInfluencer(data.influencer);
        setShowRemoveModal(true);
        break;
      case 'added':
        // Backend now handles exclusivity automatically - just add to selected
        addToList(data.influencer, 'selected')
          .then(() => {
            // Update local state immediately
            setSelectedIds(prev => [...prev, data.influencer.id]);
            // If in selected tab, remove from current view
            if (activeTab === 'selected' || activeTab === 'requests') {
              setInfluencers(prev => prev.filter(inf => inf.id !== data.influencer.id));
            }
            setRefreshCounts(prev => prev + 1);
          })
          .catch(error => {
            console.error('Failed to add to selected list:', error);
          });
        break;
      case 'acceptRequest':
        // Accept a collaboration request and move to selected
        handleAcceptRequest(data.requestId, data.influencer)
          .then(() => {

            // Remove from requests view
            setInfluencers(prev => prev.filter(inf => inf.id !== data.influencer.id));
            // Add to selected list
            setSelectedIds(prev => [...prev, data.influencer.id]);
            setRefreshCounts(prev => prev + 1);
            
            // Show success message to user
            window.showToast(`${data.influencer.name} has been accepted and moved to the Selected tab!`, 'success');
          })
          .catch(error => {
            console.error('Failed to accept request:', error);
            window.showToast(`Failed to accept request for ${data.influencer.name}. Please try again.`, 'error');
          });
        break;
      case 'rejectRequest':
        // Reject a collaboration request and remove from requests view
        handleRejectRequest(data.requestId, data.influencer)
          .then(() => {
            // Remove from requests view
            setInfluencers(prev => prev.filter(inf => inf.id !== data.influencer.id));
            setRefreshCounts(prev => prev + 1);
            
            // If we're on the selected tab, refresh the data to reflect the automatic removal
            if (activeTab === 'selected') {
              fetchInfluencers(true, 'selected');
            }
          })
          .catch(error => {
            console.error('Failed to reject request:', error);
          });
        break;
      case 'showWithdrawModal':
        // Show withdraw modal for multiple campaigns
        setWithdrawInfluencer(data.influencer);
        setShowWithdrawModal(true);
        break;
      case 'withdrawRequest':
        // Withdraw a collaboration request and remove from requests view
        handleWithdrawRequest(data.requestId, data.influencer)
          .then(() => {
            // Remove from requests view (already handled in handleWithdrawRequest)
            setRefreshCounts(prev => prev + 1);
          })
          .catch(error => {
            console.error('Failed to withdraw request:', error);
          });
        break;
      case 'error':
        console.error('Card action error:', data.error);
        break;
      default:
        console.warn('Unknown card action:', action);
    }
  }, [activeTab, addToList]);

  // Handle campaign selection
  const handleCampaignSelect = useCallback(async (campaign, influencer) => {
    try {
      // Create collaboration request
      const response = await fetch('http://localhost:5052/api/collaboration-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderType: 'brand',
          senderId: 1, // Assuming brand ID 1 for now - this should come from auth context
          receiverType: 'influencer',
          receiverId: influencer.id,
          campaignId: campaign.id,
          requestType: 'campaign_assignment'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create collaboration request');
      }
      
      const result = await response.json();
      
      if (result.success) {
        // Don't add to selectedIds in the "All" tab to maintain original appearance
        // The collaboration status will be handled by the collaboration status system
        
        // Refresh counts
        setRefreshCounts(prev => prev + 1);
        
        // If we're on the requests tab, refresh the data to show the new request
        if (activeTab === 'requests') {
          fetchInfluencers(true, 'requests');
        }
        
        // Show success message (you might want to add a toast notification here)
      } else {
        console.error('Failed to create collaboration request:', result.message);
      }
    } catch (error) {
      console.error('Error creating collaboration request:', error);
      // You might want to show an error toast notification here
    } finally {
      setShowCampaignModal(false);
      setSelectedInfluencer(null);
    }
  }, [activeTab, fetchInfluencers]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setShowCampaignModal(false);
    setSelectedInfluencer(null);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    // Immediately clear the influencers array to prevent showing old data
    setInfluencers([]);
    setActiveTab(tab);
    setPage(1);
    setIsInitialLoad(true);
    setError(null);
    setLoading(true);
    
    // Reset request type when switching to requests tab
    if (tab === 'requests') {
      setRequestType('sent');
    }
    
    // Fetch new data for the selected tab
    fetchInfluencers(true, tab);
  }, [fetchInfluencers]);

  // Fetch influencers when dependencies change (only for 'all' tab)
  useEffect(() => {
    if (activeTab === 'all') {

      fetchInfluencers(true, 'all');
    }
  }, [debouncedSearchTerm, filters]);

  // Load more when page changes
  useEffect(() => {
    if (page > 1) {
      fetchInfluencers(false, activeTab);
    }
  }, [page, activeTab]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMore]);

  // Initial load - only run once on component mount
  useEffect(() => {

    fetchInfluencers(true, activeTab);
  }, []);

  // Handle real-time collaboration updates
  useEffect(() => {
    if (collaborationUpdate) {
      const { action, request } = collaborationUpdate;
      
      switch (action) {
        case 'created':
          // Refresh the current view to show new request
          if (activeTab === 'requests') {
            fetchInfluencers(true, 'requests');
          }
          break;
        case 'status_updated':
          // Update the specific request in the list
          if (activeTab === 'requests') {
            setInfluencers(prev => 
              prev.map(inf => {
                // Check if this influencer has the updated request
                if (inf.collaboration_requests && inf.collaboration_requests.some(req => req.id === request.id)) {
                  return {
                    ...inf,
                    collaboration_requests: inf.collaboration_requests.map(req => 
                      req.id === request.id ? { ...req, ...request } : req
                    )
                  };
                }
                return inf;
              })
            );
          }
          break;
        default:
          break;
      }
    }
  }, [collaborationUpdate, activeTab]);

  // Debug: Monitor influencers state changes
  useEffect(() => {

  }, [influencers, isInitialLoad, loading, activeTab]);

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.platforms.length > 0) count += filters.platforms.length;
    if (filters.contentCategories.length > 0) count += filters.contentCategories.length;
    if (filters.ageGroups.length > 0) count += filters.ageGroups.length;
    if (filters.genders.length > 0) count += filters.genders.length;
    if (filters.countries.length > 0) count += filters.countries.length;
    if (filters.collaborationStatus !== 'none') count += 1;
    if (filters.minFollowers || filters.maxFollowers) count += 1;
    if (filters.minEngagement || filters.maxEngagement) count += 1;
    if (filters.lastActive) count += 1;
    return count;
  };

  const handleNotificationClick = () => {
    // Handle notification click
  };

  const handleRemove = async (campaignsToRemove) => {
    try {

      
      // The RemoveModal has already made the API call to remove from database
      // Now we need to update the UI state properly
      
      // Get the influencer_lists entry IDs that were removed
      const removedEntryIds = campaignsToRemove.map(campaign => campaign.id);
      
      // Check if this influencer has any remaining campaign assignments
      // We need to fetch the current campaigns for this influencer
      const response = await fetch(`http://localhost:5052/api/influencers/${removeInfluencer.id}/campaigns`);
      const result = await response.json();
      
      if (result.success) {
        const remainingCampaigns = result.data.filter(campaign => 
          !removedEntryIds.includes(campaign.id)
        );
        
        // If no campaigns remain, remove the influencer from the selected tab
        if (remainingCampaigns.length === 0) {

          
          // Remove from selectedIds
          setSelectedIds(prev => prev.filter(id => id !== removeInfluencer.id));
          
          // Remove from current view if in selected tab
          if (activeTab === 'selected') {
            setInfluencers(prev => prev.filter(inf => inf.id !== removeInfluencer.id));
          }
        } else {

          // The influencer stays in the selected tab but with fewer campaigns
        }
      } else {
        console.error('Failed to fetch remaining campaigns:', result.message);
        // Fallback: remove from UI anyway
        setSelectedIds(prev => prev.filter(id => id !== removeInfluencer.id));
        if (activeTab === 'selected') {
          setInfluencers(prev => prev.filter(inf => inf.id !== removeInfluencer.id));
        }
      }
      
      // Refresh counts
      setRefreshCounts(prev => prev + 1);
      
      // Show success message

      
    } catch (error) {
      console.error('Error removing influencer from campaigns:', error);
      // Show error message to user
      window.showToast('Error removing influencer from campaigns. Please try again.', 'error');
    }
  };

  /**
   * Handle when a collaboration request is sent successfully
   * @param {Object} data - Request data
   */
  const handleRequestSent = (data) => {
    // Don't add to selectedIds in the "All" tab to maintain original appearance
    // The collaboration status will be handled by the collaboration status system
    
    // Refresh counts
    setRefreshCounts(prev => prev + 1);
    
    // Close the modal
    setShowCampaignModal(false);
    setSelectedInfluencer(null);
  };

  /**
   * Handle accepting a collaboration request
   * @param {string} requestId - The request ID to accept
   * @param {Object} influencer - The influencer data
   * @returns {Promise} Promise that resolves when request is accepted
   */
  const handleAcceptRequest = async (requestId, influencer) => {
    try {

      
      // Update the collaboration request status to 'accepted'
      // The backend will automatically add the influencer to the selected list
      const response = await fetch(`http://localhost:5052/api/collaboration-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'accepted'
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to accept request ${requestId}: ${errorText}`);
      }
      
      const result = await response.json();
      
      // Backend already handles adding to selected list, no need to call addToList again

      
      return result;
    } catch (error) {
      console.error('❌ Error accepting request:', error);
      throw error;
    }
  };

  /**
   * Handle rejecting a collaboration request
   * @param {string} requestId - The request ID to reject
   * @param {Object} influencer - The influencer data
   * @returns {Promise} Promise that resolves when request is rejected
   */
  const handleRejectRequest = async (requestId, influencer) => {
    try {
      // Update the collaboration request status to 'rejected'
      const response = await fetch(`http://localhost:5052/api/collaboration-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to reject request ${requestId}`);
      }
      
      const result = await response.json();
      
      // If the influencer is in the selected list, automatically remove them
      if (selectedIds.includes(influencer.id)) {
        try {
          // Find the influencer in the current influencers list to get the list_entry_id
          const currentInfluencer = influencers.find(inf => inf.id === influencer.id);
          
          if (currentInfluencer && currentInfluencer.list_entry_id) {
            // Update the status to 'rejected' which will automatically delete the entry
            const updateResponse = await fetch(`http://localhost:5052/api/influencers/lists/${currentInfluencer.list_entry_id}/status`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                status: 'rejected'
              })
            });
            
            if (updateResponse.ok) {
              // Remove from selectedIds since the entry is now deleted
              setSelectedIds(prev => prev.filter(id => id !== influencer.id));
            }
          }
        } catch (listError) {
          console.error('Error removing influencer from selected list:', listError);
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error rejecting request:', error);
      throw error;
    }
  };

  /**
   * Handle withdrawing a collaboration request
   * @param {string} requestId - The request ID to withdraw
   * @param {Object} influencer - The influencer data
   * @returns {Promise} Promise that resolves when request is withdrawn
   */
  const handleWithdrawRequest = async (requestId, influencer) => {
    try {
      // Delete the single collaboration request
      const response = await fetch(`http://localhost:5052/api/collaboration-requests/${requestId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to withdraw request ${requestId}`);
      }
      
      const result = await response.json();
      
      // Remove from current view
      setInfluencers(prev => prev.filter(inf => inf.id !== influencer.id));
      
      // Refresh counts
      setRefreshCounts(prev => prev + 1);
      
      return { success: true, message: 'Request withdrawn successfully' };
    } catch (error) {
      console.error('Error withdrawing request:', error);
      throw error;
    }
  };

  const handleWithdrawMultiple = async (campaignsToWithdraw, influencer) => {
    try {
      // Delete selected collaboration requests
      const withdrawPromises = campaignsToWithdraw.map(async (campaign) => {
        const response = await fetch(`http://localhost:5052/api/collaboration-requests/${campaign.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to withdraw request ${campaign.id}`);
        }
        
        return response.json();
      });
      
      await Promise.all(withdrawPromises);
      
      // Check if all campaigns were withdrawn
      const remainingCampaigns = influencer.all_requests.filter(campaign => 
        !campaignsToWithdraw.some(withdrawn => withdrawn.id === campaign.id)
      );
      
      // If all campaigns were withdrawn, remove the influencer from the list
      if (remainingCampaigns.length === 0) {
        setInfluencers(prev => prev.filter(inf => inf.id !== influencer.id));
      } else {
        // Update the influencer's all_requests to reflect the remaining campaigns
        setInfluencers(prev => prev.map(inf => 
          inf.id === influencer.id 
            ? { ...inf, all_requests: remainingCampaigns }
            : inf
        ));
      }
      
      // Refresh counts
      setRefreshCounts(prev => prev + 1);
      
      return { success: true, message: 'Selected requests withdrawn successfully' };
    } catch (error) {
      console.error('Error withdrawing multiple requests:', error);
      throw error;
    }
  };

  return (
    <div className={`search-page ${sidebarOpen ? 'search-page--sidebar-open' : ''}`}>
      {/* Independent Notification Button */}
      <div className="search-notification-button">
        <NotificationSidebar 
          count={3} 
          onClick={handleNotificationClick}
          className="search-notification"
        />
      </div>

      <div className="search-page__main">
        <div className="search-page__container">
          {/* Enhanced Header */}
          <Header 
            activeTab={activeTab}
            onTabChange={handleTabChange}
            onRefreshCounts={() => setRefreshCounts(prev => prev + 1)}
            requestType={requestType}
            onRequestTypeChange={setRequestType}
          />

          {/* Enhanced Toolbar */}
          <div className="search-page__toolbar">
            <div className="search-page__toolbar-left">
              <button
                className="search-page__filter-toggle"
                onClick={() => setFilterSidebarOpen(!filterSidebarOpen)}
                aria-label="Toggle filters"
              >
                <svg className="search-page__filter-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/>
                </svg>
                Filters
                {getActiveFiltersCount() > 0 && (
                  <span className="search-page__filter-badge">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>
              
              {/* Real-time connection status */}
              <div className="search-page__connection-status">
                <div className={`search-page__connection-indicator ${connectionStatus.isConnected ? 'connected' : 'disconnected'}`}>
                  <div className="search-page__connection-dot"></div>
                  <span className="search-page__connection-text">
                    {connectionStatus.isConnected ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
              
              {getActiveFiltersCount() > 0 && (
                <button
                  className="search-page__clear-filters"
                  onClick={handleClearAll}
                  aria-label="Clear all filters"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="search-page__toolbar-center">
              {/* Search Bar */}
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                filters={filters}
                onFilterRemove={handleFilterRemove}
                onClearAll={handleClearAll}
              />
            </div>

            <div className="search-page__toolbar-right">
              {!isInitialLoad && !loading && (
                <div className="search-page__results-count">
                  {influencers.length} {influencers.length === 1 ? 'influencer' : 'influencers'} found
                </div>
              )}
            </div>
          </div>



          {/* Enhanced Error State */}
          {error && (
            <div className="search-page__error">
              <div className="search-page__error-icon">⚠️</div>
              <p>{error}</p>
              <button
                className="search-page__retry"
                onClick={() => fetchInfluencers(true)}
              >
                Try Again
              </button>
            </div>
          )}

          {/* Enhanced Loading State */}
          {isInitialLoad && loading && (
            <div className="search-page__loading">
              <div className="search-page__loading-spinner"></div>
              <p>Discovering amazing influencers...</p>
            </div>
          )}

          {/* Debug Info */}

          
          {/* Enhanced Results Grid */}
          {!isInitialLoad && !loading && influencers.length > 0 && (
            <div className="search-page__grid">

              {influencers.map((influencer) => (
                <InfluencerCard
                  key={influencer.id}
                  influencer={influencer}
                  onAction={handleCardAction}
                  isSelected={selectedIds.includes(influencer.id)}
                  isRejected={false} // Removed rejected state
                  activeTab={activeTab}
                  collaborationStatus={collaborationStatus}
                  requestType={requestType}
                />
              ))}
            </div>
          )}

          {/* Enhanced No Results */}
          {!isInitialLoad && !loading && influencers.length === 0 && !error && (
            <div className="search-page__no-results">
              <div className="search-page__no-results-icon">🔍</div>
              <h3>No influencers found</h3>
              <p>
                {searchTerm || getActiveFiltersCount() > 0 
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by searching for influencers or adjusting your filters'
                }
              </p>
              {(searchTerm || getActiveFiltersCount() > 0) && (
                <button
                  className="search-page__clear-search"
                  onClick={() => {
                    setSearchTerm('');
                    handleClearAll();
                  }}
                >
                  Clear search & filters
                </button>
              )}
            </div>
          )}

          {/* Enhanced Load More */}
          {!loading && hasMore && influencers.length > 0 && (
            <div className="search-page__load-more">
              <button
                className="search-page__load-more-button"
                onClick={loadMore}
                disabled={loading}
              >
                Load More Influencers
              </button>
            </div>
          )}

          {/* Enhanced Loading More */}
          {loading && !isInitialLoad && influencers.length > 0 && (
            <div className="search-page__loading-more">
              <div className="search-page__loading-spinner"></div>
              <p>Loading more influencers...</p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Filter Sidebar */}
      <FilterSidebar
        isOpen={filterSidebarOpen}
        onClose={() => setFilterSidebarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onFilterRemove={handleFilterRemove}
        onClearAll={handleClearAll}
      />

      {/* Campaign Selection Modal */}
      {showCampaignModal && (
        <CampaignSelectionModal
          isOpen={showCampaignModal}
          onClose={() => setShowCampaignModal(false)}
          influencer={selectedInfluencer}
          onSelect={(campaign) => handleCampaignSelect(campaign, selectedInfluencer)}
          selectedInfluencerIds={selectedIds}
        />
      )}

      {/* View Details Modal */}
      {showViewDetailsModal && (
        <ViewDetailsModal
          isOpen={showViewDetailsModal}
          onClose={() => setShowViewDetailsModal(false)}
          influencer={viewDetailsInfluencer}
        />
      )}

      {/* Remove Modal */}
      {showRemoveModal && (
        <RemoveModal
          isOpen={showRemoveModal}
          onClose={() => setShowRemoveModal(false)}
          onRemove={handleRemove}
          influencer={removeInfluencer}
        />
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <WithdrawModal
          isOpen={showWithdrawModal}
          onClose={() => setShowWithdrawModal(false)}
          onWithdraw={(campaignsToWithdraw) => handleWithdrawMultiple(campaignsToWithdraw, withdrawInfluencer)}
          influencer={withdrawInfluencer}
        />
      )}
    </div>
  );
};

// PropTypes for type checking and documentation
SearchPage.propTypes = {
  sidebarOpen: PropTypes.bool
};

export default SearchPage; 