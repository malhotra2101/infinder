/**
 * Campaign Influencer Controller
 * 
 * Handles all campaign-influencer relationship operations including
 * assigning influencers to campaigns, updating status, and retrieving
 * campaign-specific influencer lists.
 */

const { initializeSupabase } = require('../config/database');

/**
 * Assign influencer to a campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const assignInfluencerToCampaign = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { campaignId, influencerId, status = 'pending' } = req.body;

    if (!campaignId || !influencerId) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID and Influencer ID are required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'selected', 'rejected', 'suggested', 'approved', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Check if campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, campaign_name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Check if influencer exists
    const { data: influencer, error: influencerError } = await supabase
      .from('influencers')
      .select('id, name')
      .eq('id', influencerId)
      .single();

    if (influencerError || !influencer) {
      return res.status(404).json({
        success: false,
        message: 'Influencer not found'
      });
    }

    // Assign influencer to campaign (upsert to handle existing assignments)
    const { data, error } = await supabase
      .from('campaign_influencers')
      .upsert({
        campaign_id: campaignId,
        influencer_id: influencerId,
        status: status,
        assigned_at: new Date().toISOString()
      }, {
        onConflict: 'campaign_id,influencer_id',
        ignoreDuplicates: false
      })
      .select(`
        *,
        campaigns(campaign_name, brand_name),
        influencers(name, avatar, platform, followers, engagement_rate)
      `);

    if (error) {
      console.error('Error assigning influencer to campaign:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to assign influencer to campaign',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: `Influencer ${influencer.name} assigned to campaign ${campaign.campaign_name} with status: ${status}`,
      data: data[0]
    });

  } catch (error) {
    console.error('Assign influencer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get influencers by campaign and status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencersByCampaignAndStatus = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { campaignId, status } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID is required'
      });
    }

    // Validate status if provided
    if (status) {
      const validStatuses = ['pending', 'selected', 'rejected', 'suggested', 'approved', 'completed'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }
    }

    // Check if campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, campaign_name, brand_name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Build query
    let query = supabase
      .from('campaign_influencers')
      .select(`
        *,
        influencers(
          id,
          name,
          avatar,
          bio,
          platform,
          followers,
          engagement_rate,
          category,
          country,
          age_group
        )
      `, { count: 'exact' })
      .eq('campaign_id', campaignId);

    // Apply status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    query = query.range(from, to);

    // Order by assignment date (newest first)
    query = query.order('assigned_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching campaign influencers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign influencers',
        error: error.message
      });
    }

    // Transform data to include campaign info
    const transformedData = data.map(item => ({
      ...item,
      campaign: {
        id: campaign.id,
        name: campaign.campaign_name,
        brand_name: campaign.brand_name
      }
    }));

    return res.json({
      success: true,
      message: 'Campaign influencers fetched successfully',
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.campaign_name,
          brand_name: campaign.brand_name
        },
        influencers: transformedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit)),
          hasMore: data && data.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get campaign influencers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update influencer status for a campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateInfluencerStatus = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    // Validate status
    const validStatuses = ['pending', 'selected', 'rejected', 'suggested', 'approved', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Update the status
    const { data, error } = await supabase
      .from('campaign_influencers')
      .update({
        status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        campaigns(campaign_name, brand_name),
        influencers(name, avatar, platform, followers, engagement_rate)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Campaign-influencer assignment not found'
        });
      }
      console.error('Error updating influencer status:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update influencer status',
        error: error.message
      });
    }

    return res.json({
      success: true,
      message: `Influencer status updated to: ${status}`,
      data
    });

  } catch (error) {
    console.error('Update influencer status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Remove influencer from campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeInfluencerFromCampaign = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    // Get the assignment details before deletion
    const { data: assignment, error: fetchError } = await supabase
      .from('campaign_influencers')
      .select(`
        *,
        campaigns(campaign_name, brand_name),
        influencers(name)
      `)
      .eq('id', id)
      .single();

    if (fetchError || !assignment) {
      return res.status(404).json({
        success: false,
        message: 'Campaign-influencer assignment not found'
      });
    }

    // Delete the assignment
    const { error: deleteError } = await supabase
      .from('campaign_influencers')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error removing influencer from campaign:', deleteError);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove influencer from campaign',
        error: deleteError.message
      });
    }

    return res.json({
      success: true,
      message: `Influencer ${assignment.influencers.name} removed from campaign ${assignment.campaigns.campaign_name}`,
      data: assignment
    });

  } catch (error) {
    console.error('Remove influencer error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get campaign influencers summary
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCampaignInfluencersSummary = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { campaignId } = req.params;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID is required'
      });
    }

    // Check if campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, campaign_name, brand_name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Get summary by status
    const { data: summary, error: summaryError } = await supabase
      .from('campaign_influencers')
      .select('status')
      .eq('campaign_id', campaignId);

    if (summaryError) {
      console.error('Error fetching campaign summary:', summaryError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign summary',
        error: summaryError.message
      });
    }

    // Count by status
    const statusCounts = summary.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});

    // Get total count
    const totalInfluencers = summary.length;

    return res.json({
      success: true,
      message: 'Campaign influencers summary fetched successfully',
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.campaign_name,
          brand_name: campaign.brand_name
        },
        summary: {
          total: totalInfluencers,
          byStatus: statusCounts
        }
      }
    });

  } catch (error) {
    console.error('Get campaign summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all influencers for a campaign (all statuses)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllCampaignInfluencers = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { campaignId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (!campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID is required'
      });
    }

    // Check if campaign exists
    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .select('id, campaign_name, brand_name')
      .eq('id', campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Get all influencers for the campaign
    let query = supabase
      .from('campaign_influencers')
      .select(`
        *,
        influencers(
          id,
          name,
          avatar,
          bio,
          platform,
          followers,
          engagement_rate,
          category,
          country,
          age_group
        )
      `, { count: 'exact' })
      .eq('campaign_id', campaignId);

    // Apply pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;
    query = query.range(from, to);

    // Order by assignment date (newest first)
    query = query.order('assigned_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching all campaign influencers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign influencers',
        error: error.message
      });
    }

    // Transform data to include campaign info
    const transformedData = data.map(item => ({
      ...item,
      campaign: {
        id: campaign.id,
        name: campaign.campaign_name,
        brand_name: campaign.brand_name
      }
    }));

    return res.json({
      success: true,
      message: 'All campaign influencers fetched successfully',
      data: {
        campaign: {
          id: campaign.id,
          name: campaign.campaign_name,
          brand_name: campaign.brand_name
        },
        influencers: transformedData,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit)),
          hasMore: data && data.length === parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get all campaign influencers error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  assignInfluencerToCampaign,
  getInfluencersByCampaignAndStatus,
  updateInfluencerStatus,
  removeInfluencerFromCampaign,
  getCampaignInfluencersSummary,
  getAllCampaignInfluencers
}; 