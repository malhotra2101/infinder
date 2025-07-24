/**
 * Application Controller
 * 
 * Handles all application-related operations including
 * creating, reading, updating, and deleting applications.
 */

const { initializeSupabase } = require('../config/database');

/**
 * Create a new application (campaign-influencer assignment)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createApplication = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      influencerId,
      campaignId,
      status = 'pending'
    } = req.body;

    // Validate required fields
    if (!influencerId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: influencerId, campaignId'
      });
    }

    // Check if application already exists
    const { data: existingApplication, error: checkError } = await supabase
      .from('applications')
      .select('id')
      .eq('influencer_id', influencerId)
      .eq('campaign_id', campaignId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        message: 'Error checking existing application',
        error: checkError.message
      });
    }

    if (existingApplication) {
      return res.status(409).json({
        success: false,
        message: 'Application already exists for this influencer and campaign'
      });
    }

    // Create application data object
    const applicationData = {
      influencer_id: influencerId,
      campaign_id: campaignId,
      status
    };

    // Insert application into database
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select(`
        *,
        influencer:influencers(name, avatar, platform, followers, engagement_rate),
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `);

    if (error) {
      console.error('Error creating application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create application',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Application created successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in createApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get all applications with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getApplications = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      influencerId,
      campaignId,
      status,
      page = 1,
      limit = 20
    } = req.query;

    let query = supabase
      .from('applications')
      .select(`
        *,
        influencer:influencers(name, avatar, platform, followers, engagement_rate, country),
        campaign:campaigns(campaign_name, brand_name, platform, status, vertical)
      `)
      .order('applied_at', { ascending: false });

    // Apply filters
    if (influencerId) {
      query = query.eq('influencer_id', influencerId);
    }

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    if (status) {
      query = query.eq('status', status);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch applications',
        error: error.message
      });
    }

    res.json({
      success: true,
      data: {
        applications: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || data.length
        }
      }
    });

  } catch (error) {
    console.error('Error in getApplications:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific application by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getApplicationById = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        influencer:influencers(name, avatar, platform, followers, engagement_rate, country, bio),
        campaign:campaigns(campaign_name, brand_name, platform, status, vertical, offer_description, start_date, end_date)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      console.error('Error fetching application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch application',
        error: error.message
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in getApplicationById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update an application status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const supabase = initializeSupabase();
      const { id } = req.params;
  const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, approved, rejected, completed'
      });
    }

    // Prepare update data
    const updateData = {
      status
    };

    const { data, error } = await supabase
      .from('applications')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        influencer:influencers(name, avatar, platform, followers, engagement_rate),
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Application not found'
        });
      }
      console.error('Error updating application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update application',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Application status updated successfully',
      data
    });

  } catch (error) {
    console.error('Error in updateApplicationStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete an application
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteApplication = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting application:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete application',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteApplication:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get application statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getApplicationStats = async (req, res) => {
  try {
    const supabase = initializeSupabase();

    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('applications')
      .select('status');

    if (statusError) {
      console.error('Error fetching application stats:', statusError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch application statistics',
        error: statusError.message
      });
    }

    // Calculate statistics
    const stats = {
      total: statusCounts.length,
      pending: statusCounts.filter(app => app.status === 'pending').length,
      approved: statusCounts.filter(app => app.status === 'approved').length,
      rejected: statusCounts.filter(app => app.status === 'rejected').length,
      completed: statusCounts.filter(app => app.status === 'completed').length
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in getApplicationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats
}; 