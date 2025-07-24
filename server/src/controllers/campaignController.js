/**
 * Campaign Controller
 * 
 * Handles all campaign-related operations including
 * creating, reading, updating, and deleting campaigns.
 */

const { initializeSupabase } = require('../config/database');

/**
 * Create a new campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCampaign = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      brandName,
      campaignId,
      campaignName,
      leadflow,
      trackingUrl,
      previewUrl,
      creativeUrl,
      timezone,
      offerDescription,
      kpi,
      restrictions,
      vertical,
      countries,
      platform,
      status,
      startDate,
      endDate,
      isPrivate,
      requiresApproval
    } = req.body;

    // Validate required fields
    if (!brandName || !campaignName || !leadflow || !trackingUrl || !platform || !status) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: brandName, campaignName, leadflow, trackingUrl, platform, status'
      });
    }

    // Create campaign data object
    const campaignData = {
      brand_name: brandName,
      campaign_id: campaignId,
      campaign_name: campaignName,
      leadflow,
      tracking_url: trackingUrl,
      preview_url: previewUrl || null,
      creative_url: creativeUrl || null,
      timezone: timezone || 'UTC',
      offer_description: offerDescription || null,
      kpi: kpi || null,
      restrictions: restrictions || null,
      vertical: vertical || null,
      countries: countries || null,
      platform,
      status,
      start_date: startDate || null,
      end_date: endDate || null,
      is_private: isPrivate || false,
      requires_approval: requiresApproval || false
    };

    // Insert campaign into database
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create campaign',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all campaigns with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCampaigns = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { status, platform, vertical, search, page = 1, limit = 10 } = req.query;

    let query = supabase
      .from('campaigns')
      .select('*')
      .order('id', { ascending: false });

    // Apply search filter
    if (search) {
      query = query.or(`campaign_name.ilike.%${search}%,brand_name.ilike.%${search}%,offer_description.ilike.%${search}%`);
    }

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (vertical) {
      query = query.eq('vertical', vertical);
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaigns',
        error: error.message
      });
    }

    // Get total unique influencers across all campaigns
    let totalUniqueInfluencers = 0;
    const allInfluencerIds = new Set();

    // Collect all influencer IDs from both tables
    for (const campaign of data) {
      try {
        // First try to get from campaign_influencers table
        const { data: campaignInfluencers, error: ciError } = await supabase
          .from('campaign_influencers')
          .select('influencer_id')
          .eq('campaign_id', campaign.id);

        if (!ciError && campaignInfluencers && campaignInfluencers.length > 0) {
          campaignInfluencers.forEach(ci => allInfluencerIds.add(ci.influencer_id));
        }

        // Fallback to influencer_lists table if campaign_influencers is empty
        const { data: influencerLists, error: ilError } = await supabase
          .from('influencer_lists')
          .select('influencer_id')
          .eq('campaign_id', campaign.id);

        if (!ilError && influencerLists && influencerLists.length > 0) {
          influencerLists.forEach(il => allInfluencerIds.add(il.influencer_id));
        }
      } catch (error) {
        console.error(`Error getting influencer count for campaign ${campaign.id}:`, error);
      }
    }

    totalUniqueInfluencers = allInfluencerIds.size;

    res.json({
      success: true,
      message: 'Campaigns fetched successfully',
      data: {
        campaigns: data,
        totalUniqueInfluencers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount || 0,
          hasMore: (parseInt(page) * parseInt(limit)) < (totalCount || 0)
        }
      }
    });

  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a single campaign by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCampaignById = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Campaign fetched successfully',
      data
    });

  } catch (error) {
    console.error('Get campaign by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update a campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCampaign = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;
    
    console.log('Update campaign request:', {
      id,
      body: req.body
    });
    
    // Map frontend field names to database field names
    const {
      brandName,
      campaignId,
      campaignName,
      leadflow,
      trackingUrl,
      previewUrl,
      creativeUrl,
      timezone,
      offerDescription,
      kpi,
      restrictions,
      vertical,
      countries,
      platform,
      status,
      startDate,
      endDate,
      isPrivate,
      requiresApproval,
      ...otherFields
    } = req.body;

    const updateData = {
      brand_name: brandName,
      campaign_id: campaignId,
      campaign_name: campaignName,
      leadflow,
      tracking_url: trackingUrl,
      preview_url: previewUrl,
      creative_url: creativeUrl,
      timezone,
      offer_description: offerDescription,
      kpi,
      restrictions,
      vertical,
      countries,
      platform,
      status,
      start_date: startDate,
      end_date: endDate,
      is_private: isPrivate,
      requires_approval: requiresApproval,
      ...otherFields
    };

    // Remove id from update data if present
    delete updateData.id;

    console.log('Update data being sent to database:', updateData);
    
    const { data, error } = await supabase
      .from('campaigns')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Database update error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Campaign not found'
        });
      }
      return res.status(500).json({
        success: false,
        message: 'Failed to update campaign',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data
    });

  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCampaign = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete campaign',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Delete campaign error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get campaign statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCampaignStats = async (req, res) => {
  try {
    const supabase = initializeSupabase();

    // Get total campaigns
    const { count: totalCampaigns } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });

    // Get campaigns by status
    const { data: statusStats } = await supabase
      .from('campaigns')
      .select('status');

    // Get campaigns by platform
    const { data: platformStats } = await supabase
      .from('campaigns')
      .select('platform');

    // Calculate statistics
    const statusCounts = {};
    const platformCounts = {};

    statusStats?.forEach(campaign => {
      statusCounts[campaign.status] = (statusCounts[campaign.status] || 0) + 1;
    });

    platformStats?.forEach(campaign => {
      platformCounts[campaign.platform] = (platformCounts[campaign.platform] || 0) + 1;
    });

    res.json({
      success: true,
      message: 'Campaign statistics fetched successfully',
      data: {
        totalCampaigns,
        statusCounts,
        platformCounts
      }
    });

  } catch (error) {
    console.error('Get campaign stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  getCampaignStats
}; 