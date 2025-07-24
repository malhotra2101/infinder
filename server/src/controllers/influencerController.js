/**
 * Influencer Controller
 * 
 * Handles all influencer-related API operations including
 * fetching, searching, filtering, and managing influencer data.
 */

const influencerService = require('../services/influencerService');
const { asyncHandler, successResponse, ApiError } = require('../utils/errorHandler');

/**
 * Get all influencers with optional filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencers = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    search = '',
    platform,
    minFollowers,
    maxFollowers,
    minEngagement,
    maxEngagement,
    country,
    ageGroup,
    lastActive,
    listType
  } = req.query;

  // TODO: Move complex filtering logic to service layer
  // For now, using the existing logic but with better error handling
  
  const supabase = require('../config/supabase').initializeSupabase();
  
  // Handle list type filtering (selected/rejected)
  if (listType && ['selected', 'rejected'].includes(listType)) {
    // Get influencer IDs from the specified list
    const { data: listData, error: listError } = await supabase
      .from('influencer_lists')
      .select('influencer_id')
      .eq('list_type', listType);
    
    if (listError) {
      throw new ApiError(`Failed to fetch list data: ${listError.message}`, 400);
    }
    
    const influencerIds = listData.map(item => item.influencer_id);
    

    
    if (influencerIds.length === 0) {
      // No influencers in this list, return empty result
      return successResponse(res, 200, 'No influencers found in list', {
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
          hasMore: false
        }
      });
    }
    
    // Query influencers that are in the specified list
    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' })
      .in('id', influencerIds);
    
    // Apply pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    
    query = query.range(from, to);
    
    // Apply sorting by engagement rate (descending)
    query = query.order('engagement_rate', { ascending: false });
    
    const { data, error, count } = await query;
    
    if (error) {
      throw new ApiError(`Failed to fetch influencers: ${error.message}`, 400);
    }
    
    return successResponse(res, 200, 'Influencers retrieved successfully', {
      data: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / parseInt(limit)),
        hasMore: data && data.length === parseInt(limit)
      }
    });
  }
  
  // Default query for all influencers
  let query = supabase
    .from('influencers')
    .select('*', { count: 'exact' });

  // Apply search filter
  if (search.trim()) {
    query = query.or(`name.ilike.%${search}%,bio.ilike.%${search}%,category.ilike.%${search}%`);
  }

  // Apply platform filter
  if (platform) {
    query = query.eq('platform', platform);
  }

  // Apply follower range filters
  if (minFollowers) {
    query = query.gte('followers', parseInt(minFollowers));
  }
  if (maxFollowers) {
    query = query.lte('followers', parseInt(maxFollowers));
  }

  // Apply engagement rate filters
  if (minEngagement) {
    query = query.gte('engagement_rate', parseFloat(minEngagement));
  }
  if (maxEngagement) {
    query = query.lte('engagement_rate', parseFloat(maxEngagement));
  }

  // Apply country filter
  if (country) {
    query = query.eq('country', country);
  }

  // Apply age group filter
  if (ageGroup) {
    query = query.eq('age_group', ageGroup);
  }

  // Apply last active filter
  if (lastActive) {
    const now = new Date();
    let cutoffDate;
    
    switch (lastActive) {
      case '1w':
        cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        cutoffDate = null;
    }
    
    if (cutoffDate) {
      query = query.gte('last_active', cutoffDate.toISOString());
    }
  }

  // Apply pagination
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;
  
  query = query.range(from, to);

  // Apply sorting by engagement rate (descending)
  query = query.order('engagement_rate', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new ApiError(`Failed to fetch influencers: ${error.message}`, 400);
  }

  successResponse(res, 200, 'Influencers retrieved successfully', {
    data: data || [],
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count || 0,
      totalPages: Math.ceil((count || 0) / parseInt(limit)),
      hasMore: data && data.length === parseInt(limit)
    }
  });
});

/**
 * Get a single influencer by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const influencer = await influencerService.getInfluencerById(id);
  successResponse(res, 200, 'Influencer retrieved successfully', influencer);
});

/**
 * Get available countries for filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCountries = asyncHandler(async (req, res) => {
  const supabase = require('../config/supabase').initializeSupabase();
  
  const { data, error } = await supabase
    .from('influencers')
    .select('country')
    .not('country', 'is', null);

  if (error) {
    throw new ApiError(`Failed to fetch countries: ${error.message}`, 400);
  }

  const countries = [...new Set(data.map(item => item.country))].sort();
  successResponse(res, 200, 'Countries retrieved successfully', countries);
});

// TODO: Refactor remaining controller methods to use service layer
// For now, keeping existing methods but adding proper error handling

/**
 * Add influencer to list (selected/rejected)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addToList = asyncHandler(async (req, res) => {
  const { influencerId, listType, campaignId } = req.body;
  
  if (!influencerId || !listType) {
    throw new ApiError('Influencer ID and list type are required', 400);
  }

  if (!['selected'].includes(listType)) {
    throw new ApiError('List type must be "selected"', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();

  // Check if already in list (with campaign_id if provided)
  let query = supabase
    .from('influencer_lists')
    .select('*')
    .eq('influencer_id', influencerId)
    .eq('list_type', listType);

  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  } else {
    query = query.is('campaign_id', null);
  }

  const { data: existing, error: checkError } = await query.single();

  if (checkError && checkError.code !== 'PGRST116') {
    throw new ApiError(`Failed to check existing list entry: ${checkError.message}`, 400);
  }

  if (existing) {
    throw new ApiError('Influencer is already in this list', 409);
  }

  // Add to list
  const insertData = {
    influencer_id: influencerId,
    list_type: listType,
    added_at: new Date().toISOString()
  };

  if (campaignId) {
    insertData.campaign_id = campaignId;
  }

  const { data, error } = await supabase
    .from('influencer_lists')
    .upsert(insertData, {
      onConflict: campaignId ? 'influencer_id,list_type,campaign_id' : 'influencer_id,list_type',
      ignoreDuplicates: false
    })
    .select()
    .single();

  if (error) {
    throw new ApiError(`Failed to add influencer to list: ${error.message}`, 400);
  }

  // Clean up any existing collaboration requests for this influencer-campaign combination
  if (campaignId) {
    const { error: collaborationError } = await supabase
      .from('collaboration_requests')
      .delete()
      .or(`and(sender_type.eq.influencer,sender_id.eq.${influencerId},campaign_id.eq.${campaignId}),and(receiver_type.eq.influencer,receiver_id.eq.${influencerId},campaign_id.eq.${campaignId})`);

    if (collaborationError) {
      console.error('Warning: Failed to clean up collaboration requests:', collaborationError);
      // Don't throw error here as the main operation (adding to influencer_lists) was successful
    } else {
      console.log(`Cleaned up collaboration requests for influencer ${influencerId} and campaign ${campaignId}`);
    }
  }

  successResponse(res, 201, 'Influencer added to list successfully', data);
});

// TODO: Continue refactoring remaining methods...
// For brevity, I'll add TODO comments for the remaining methods

/**
 * Get influencers by list type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencersByListType = asyncHandler(async (req, res) => {
  const { type } = req.params;
  const { page = 1, limit = 20 } = req.query;
  
  if (!['selected', 'suggested'].includes(type)) {
    throw new ApiError('Invalid list type. Must be selected or suggested', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();
  
  // Get influencer IDs from the specified list
  const { data: listData, error: listError } = await supabase
    .from('influencer_lists')
    .select('influencer_id')
    .eq('list_type', type);

  if (listError) {
    throw new ApiError(`Failed to fetch list data: ${listError.message}`, 400);
  }

  const influencerIds = listData.map(item => item.influencer_id);
  
  if (influencerIds.length === 0) {
    return successResponse(res, 200, 'No influencers found in list', {
      data: [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 0,
        totalPages: 0,
        hasMore: false
      }
    });
  }

  // Query influencers that are in the specified list
  let query = supabase
    .from('influencers')
    .select('*', { count: 'exact' })
    .in('id', influencerIds);

  // Apply pagination
  const from = (parseInt(page) - 1) * parseInt(limit);
  const to = from + parseInt(limit) - 1;
  
  query = query.range(from, to);
  
  // Apply sorting by engagement rate (descending)
  query = query.order('engagement_rate', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    throw new ApiError(`Failed to fetch influencers: ${error.message}`, 400);
  }

  successResponse(res, 200, 'Influencers retrieved successfully', {
    data: data || [],
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count || 0,
      totalPages: Math.ceil((count || 0) / parseInt(limit)),
      hasMore: data && data.length === parseInt(limit)
    }
  });
});

/**
 * Get list counts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getListCounts = asyncHandler(async (req, res) => {
  const supabase = require('../config/supabase').initializeSupabase();
  
  // Get counts for each list type
  const { data, error } = await supabase
    .from('influencer_lists')
    .select('list_type');

  if (error) {
    throw new ApiError(`Failed to fetch list counts: ${error.message}`, 400);
  }

  // Initialize counts object
  const counts = {
    selected: 0,
    suggested: 0,
    total: 0
  };

  // Count occurrences of each list type
  data?.forEach(item => {
    if (counts.hasOwnProperty(item.list_type)) {
      counts[item.list_type]++;
      counts.total++;
    }
  });

  successResponse(res, 200, 'List counts retrieved successfully', counts);
});

/**
 * Remove influencer from list
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeFromList = asyncHandler(async (req, res) => {
  const { influencerId, listType } = req.body;
  
  if (!influencerId || !listType) {
    throw new ApiError('Influencer ID and list type are required', 400);
  }

  if (!['selected', 'suggested'].includes(listType)) {
    throw new ApiError('List type must be selected or suggested', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();

  // Get the campaign IDs before removing from list
  const { data: listEntries, error: fetchError } = await supabase
    .from('influencer_lists')
    .select('campaign_id')
    .eq('influencer_id', influencerId)
    .eq('list_type', listType);

  if (fetchError) {
    throw new ApiError(`Failed to fetch list entries: ${fetchError.message}`, 400);
  }

  // Remove from list
  const { data, error } = await supabase
    .from('influencer_lists')
    .delete()
    .eq('influencer_id', influencerId)
    .eq('list_type', listType)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError('Influencer not found in this list', 404);
    }
    throw new ApiError(`Failed to remove influencer from list: ${error.message}`, 400);
  }

  // Clean up corresponding collaboration requests for the campaigns that were removed
  if (listEntries && listEntries.length > 0) {
    const campaignIds = listEntries.map(entry => entry.campaign_id).filter(id => id !== null);
    
    if (campaignIds.length > 0) {
      const { error: collaborationError } = await supabase
        .from('collaboration_requests')
        .delete()
        .or(`and(sender_type.eq.influencer,sender_id.eq.${influencerId},campaign_id.in.(${campaignIds.join(',')})),and(receiver_type.eq.influencer,receiver_id.eq.${influencerId},campaign_id.in.(${campaignIds.join(',')}))`);

      if (collaborationError) {
        console.error('Warning: Failed to clean up collaboration requests:', collaborationError);
        // Don't throw error here as the main operation (removing from influencer_lists) was successful
      }
    }
  }

  successResponse(res, 200, 'Influencer removed from list successfully', data);
});

/**
 * Remove influencer from campaigns
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeFromCampaigns = asyncHandler(async (req, res) => {
  const { influencerId, campaignIds } = req.body;
  
  if (!influencerId || !campaignIds || !Array.isArray(campaignIds)) {
    throw new ApiError('Influencer ID and array of campaign IDs are required', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();

  // Remove from influencer_lists table for the specified campaigns
  const { data, error } = await supabase
    .from('influencer_lists')
    .delete()
    .eq('influencer_id', influencerId)
    .in('campaign_id', campaignIds)
    .select();

  if (error) {
    throw new ApiError(`Failed to remove influencer from campaigns: ${error.message}`, 400);
  }

  // Also clean up corresponding collaboration requests
  // Delete collaboration requests where this influencer is involved with these campaigns
  const { error: collaborationError } = await supabase
    .from('collaboration_requests')
    .delete()
    .or(`and(sender_type.eq.influencer,sender_id.eq.${influencerId},campaign_id.in.(${campaignIds.join(',')})),and(receiver_type.eq.influencer,receiver_id.eq.${influencerId},campaign_id.in.(${campaignIds.join(',')}))`);

  if (collaborationError) {
    console.error('Warning: Failed to clean up collaboration requests:', collaborationError);
    // Don't throw error here as the main operation (removing from influencer_lists) was successful
  }

  successResponse(res, 200, 'Influencer removed from campaigns successfully', {
    removedCount: data?.length || 0,
    campaignIds: campaignIds
  });
});

/**
 * Get influencer campaigns
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencerCampaigns = asyncHandler(async (req, res) => {
  const { influencerId } = req.params;
  
  if (!influencerId) {
    throw new ApiError('Influencer ID is required', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();

  // Get campaigns for this influencer from influencer_lists table
  const { data, error } = await supabase
    .from('influencer_lists')
    .select(`
      id,
      influencer_id,
      campaign_id,
      list_type,
      added_at
    `)
    .eq('influencer_id', influencerId)
    .not('campaign_id', 'is', null);

  if (error) {
    throw new ApiError(`Failed to fetch influencer campaigns: ${error.message}`, 400);
  }

  // Get campaign details for each campaign_id
  const campaignIds = data?.map(item => item.campaign_id) || [];
  let campaignDetails = {};
  
  if (campaignIds.length > 0) {
    const { data: campaignData, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, campaign_name, brand_name, platform, status')
      .in('id', campaignIds);
    
    if (campaignError) {
      throw new ApiError(`Failed to fetch campaign details: ${campaignError.message}`, 400);
    }
    
    // Create a map of campaign details by ID
    campaignDetails = campaignData?.reduce((acc, campaign) => {
      acc[campaign.id] = campaign;
      return acc;
    }, {}) || {};
  }

  // Transform the data to a cleaner format
  const campaigns = data?.map((item, index) => ({
    id: item.id || `entry-${index}`,
    campaignId: item.campaign_id,
    listType: item.list_type,
    addedAt: item.added_at,
    campaign: campaignDetails[item.campaign_id] || null
  })) || [];

  successResponse(res, 200, 'Influencer campaigns retrieved successfully', campaigns);
});

/**
 * Reset lists
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resetLists = asyncHandler(async (req, res) => {
  const supabase = require('../config/supabase').initializeSupabase();

  // Delete all entries from influencer_lists table
  const { data, error } = await supabase
    .from('influencer_lists')
    .delete()
    .neq('id', 0) // Delete all records
    .select();

  if (error) {
    throw new ApiError(`Failed to reset lists: ${error.message}`, 400);
  }

  // Also clean up all collaboration requests
  const { error: collaborationError } = await supabase
    .from('collaboration_requests')
    .delete()
    .neq('id', 0); // Delete all records

  if (collaborationError) {
    console.error('Warning: Failed to clean up collaboration requests:', collaborationError);
    // Don't throw error here as the main operation (resetting influencer_lists) was successful
  }

  successResponse(res, 200, 'All lists reset successfully', {
    deletedCount: data?.length || 0
  });
});

/**
 * Update influencer list status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateInfluencerListStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!id || !status) {
    throw new ApiError('List entry ID and status are required', 400);
  }

  if (!['selected', 'rejected', 'suggested'].includes(status)) {
    throw new ApiError('Status must be selected, rejected, or suggested', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();

  // If status is 'rejected', delete the entry entirely instead of updating it
  if (status === 'rejected') {
    // Get the entry details before deletion to clean up collaboration requests
    const { data: entry, error: fetchError } = await supabase
      .from('influencer_lists')
      .select('influencer_id, campaign_id')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new ApiError(`Failed to fetch list entry: ${fetchError.message}`, 400);
    }

    const { error: deleteError } = await supabase
      .from('influencer_lists')
      .delete()
      .eq('id', id);

    if (deleteError) {
      if (deleteError.code === 'PGRST116') {
        throw new ApiError('List entry not found', 404);
      }
      throw new ApiError(`Failed to delete list entry: ${deleteError.message}`, 400);
    }

    // Clean up corresponding collaboration requests if we have campaign_id
    if (entry && entry.campaign_id) {
      const { error: collaborationError } = await supabase
        .from('collaboration_requests')
        .delete()
        .or(`and(sender_type.eq.influencer,sender_id.eq.${entry.influencer_id},campaign_id.eq.${entry.campaign_id}),and(receiver_type.eq.influencer,receiver_id.eq.${entry.influencer_id},campaign_id.eq.${entry.campaign_id})`);

      if (collaborationError) {
        console.error('Warning: Failed to clean up collaboration requests:', collaborationError);
        // Don't throw error here as the main operation (deleting from influencer_lists) was successful
      }
    }

    return successResponse(res, 200, 'Influencer removed from lists successfully', {
      id: id,
      action: 'deleted',
      message: 'Influencer has been rejected and removed from all lists'
    });
  }

  // For non-rejected statuses, update normally
  const updateData = { 
    list_type: status,
    added_at: new Date().toISOString()
  };

  // Update the list status
  const { data, error } = await supabase
    .from('influencer_lists')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new ApiError('List entry not found', 404);
    }
    throw new ApiError(`Failed to update list status: ${error.message}`, 400);
  }

  successResponse(res, 200, 'List status updated successfully', data);
});

/**
 * Send collaboration request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const sendCollaborationRequest = asyncHandler(async (req, res) => {
  const { influencerId, brandId, campaignId, message } = req.body;
  
  if (!influencerId || !brandId || !campaignId) {
    throw new ApiError('Influencer ID, brand ID, and campaign ID are required', 400);
  }

  const supabase = require('../config/supabase').initializeSupabase();

  // Create collaboration request
  const { data, error } = await supabase
    .from('collaboration_requests')
    .insert({
      sender_id: influencerId,
      sender_type: 'influencer',
      receiver_id: brandId,
      receiver_type: 'brand',
      campaign_id: campaignId,
      message: message || '',
      status: 'pending',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    throw new ApiError(`Failed to send collaboration request: ${error.message}`, 400);
  }

  successResponse(res, 201, 'Collaboration request sent successfully', data);
});

module.exports = {
  getInfluencers,
  getInfluencerById,
  getCountries,
  addToList,
  getInfluencersByListType,
  getListCounts,
  removeFromList,
  removeFromCampaigns,
  getInfluencerCampaigns,
  resetLists,
  updateInfluencerListStatus,
  sendCollaborationRequest
}; 