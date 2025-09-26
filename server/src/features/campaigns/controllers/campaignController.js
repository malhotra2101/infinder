/**
 * Campaign Controller
 * 
 * Handles all campaign-related operations including
 * creating, reading, updating, and deleting campaigns.
 */

const { getServiceSupabase } = require('../../../config/supabase');

/**
 * Create a new campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCampaign = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    
    const {
      brandName,
      campaignId,
      campaignName,
      leadflow,
      trackingUrl,
      previewUrl,
      creativeUrl,
      timezone = 'UTC',
      offerDescription,
      kpi,
      restrictions,
      vertical,
      countries,
      platform,
      status = 'draft',
      startDate,
      endDate,
      isPrivate = true,
      requiresApproval = true,
      budgetType = 'total',
      budget,
      minBudget,
      maxBudget,
      paymentTerms,
      currency = 'USD',
      brandId
    } = req.body;

    // Validate required fields
    if (!campaignName || !platform) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: campaignName, platform'
      });
    }

    // Create campaign data object
    const campaignData = {
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
      budget_type: budgetType,
      budget,
      min_budget: minBudget,
      max_budget: maxBudget,
      payment_terms: paymentTerms,
      currency,
      brand_id: brandId
    };

    // Insert campaign into database
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaignData])
      .select()
      .single();

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
      data: data
    });

  } catch (error) {
    console.error('Error in createCampaign:', error);
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
    const supabase = getServiceSupabase();
    
    const {
      platform,
      vertical,
      status,
      brandName,
      page = 1,
      limit = 20,
      search
    } = req.query;

    // Start building the query
    let query = supabase
      .from('campaigns')
      .select('*', { count: 'exact' });

    // Apply filters
    if (platform) {
      query = query.eq('platform', platform);
    }
    if (vertical) {
      query = query.eq('vertical', vertical);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (brandName) {
      query = query.ilike('brand_name', `%${brandName}%`);
    }
    if (search) {
      query = query.or(`campaign_name.ilike.%${search}%,brand_name.ilike.%${search}%,offer_description.ilike.%${search}%`);
    }

    // Add pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    
    query = query
      .range(from, to)
      .order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaigns',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaigns retrieved successfully',
      data: data || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        pages: Math.ceil((count || 0) / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error in getCampaigns:', error);
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
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Convert id to integer and validate
    const campaignId = parseInt(id);
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid campaign ID format'
      });
    }

    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign',
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Get the first (and should be only) campaign
    const campaign = data[0];

    res.status(200).json({
      success: true,
      message: 'Campaign retrieved successfully',
      data: campaign
    });

  } catch (error) {
    console.error('Error in getCampaignById:', error);
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
    const supabase = getServiceSupabase();
    const { id } = req.params;
    const updateData = req.body;

    // Convert id to integer and validate
    const campaignId = parseInt(id);
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid campaign ID format'
      });
    }

    // Remove id from update data if present
    delete updateData.id;
    delete updateData.created_at;

    // Convert camelCase to snake_case for database
    const convertToSnakeCase = (obj) => {
      const converted = {};
      for (const [key, value] of Object.entries(obj)) {
        const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        converted[snakeKey] = value;
      }
      return converted;
    };

    const dbUpdateData = convertToSnakeCase(updateData);

    const { data, error } = await supabase
      .from('campaigns')
      .update(dbUpdateData)
      .eq('id', campaignId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update campaign',
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign updated successfully',
      data: data
    });

  } catch (error) {
    console.error('Error in updateCampaign:', error);
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
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Convert id to integer and validate
    const campaignId = parseInt(id);
    if (isNaN(campaignId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid campaign ID format'
      });
    }

    const { error } = await supabase
      .from('campaigns')
      .delete()
      .eq('id', campaignId);

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete campaign',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteCampaign:', error);
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
    const supabase = getServiceSupabase();

    // Get total campaigns count
    const { count: totalCampaigns, error: totalError } = await supabase
      .from('campaigns')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      console.error('Database error:', totalError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch campaign stats',
        error: totalError.message
      });
    }

    // Get campaigns by status
    const { data: statusStats, error: statusError } = await supabase
      .from('campaigns')
      .select('status')
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        
        const stats = data.reduce((acc, campaign) => {
          acc[campaign.status] = (acc[campaign.status] || 0) + 1;
          return acc;
        }, {});
        
        return { data: stats, error: null };
      });

    if (statusError) {
      console.error('Database error:', statusError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch status stats',
        error: statusError.message
      });
    }

    // Get campaigns by platform
    const { data: platformStats, error: platformError } = await supabase
      .from('campaigns')
      .select('platform')
      .then(({ data, error }) => {
        if (error) return { data: null, error };
        
        const stats = data.reduce((acc, campaign) => {
          acc[campaign.platform] = (acc[campaign.platform] || 0) + 1;
          return acc;
        }, {});
        
        return { data: stats, error: null };
      });

    if (platformError) {
      console.error('Database error:', platformError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch platform stats',
        error: platformError.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign statistics retrieved successfully',
      data: {
        total: totalCampaigns || 0,
        byStatus: statusStats || {},
        byPlatform: platformStats || {}
      }
    });

  } catch (error) {
    console.error('Error in getCampaignStats:', error);
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