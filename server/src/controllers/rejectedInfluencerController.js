/**
 * Rejected Influencer Controller
 * 
 * Handles operations related to rejected influencers including
 * adding, retrieving, and managing rejected influencer records.
 */

const { initializeSupabase } = require('../config/database');

/**
 * Add an influencer to the rejected list
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addRejectedInfluencer = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      influencerId,
      brandId,
      campaignId,
      collaborationRequestId,
      rejectionReason
    } = req.body;

    // Validate required fields
    if (!influencerId || !brandId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: influencerId, brandId, campaignId'
      });
    }

    // Check if this rejection already exists
    const { data: existingRejection, error: checkError } = await supabase
      .from('rejected_influencers')
      .select('id')
      .eq('influencer_id', influencerId)
      .eq('brand_id', brandId)
      .eq('campaign_id', campaignId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        message: 'Error checking existing rejection',
        error: checkError.message
      });
    }

    if (existingRejection) {
      return res.status(409).json({
        success: false,
        message: 'Influencer is already rejected for this campaign'
      });
    }

    // Add to rejected_influencers table
    const { data, error } = await supabase
      .from('rejected_influencers')
      .insert([{
        influencer_id: influencerId,
        brand_id: brandId,
        campaign_id: campaignId,
        collaboration_request_id: collaborationRequestId || null,
        rejection_reason: rejectionReason || null
      }])
      .select(`
        *,
        influencer:influencers(name, platform, followers),
        brand:brands(name, industry),
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `);

    if (error) {
      console.error('Error adding rejected influencer:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to add rejected influencer',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Influencer added to rejected list successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in addRejectedInfluencer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get rejected influencers for a brand
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getRejectedInfluencers = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      brandId,
      campaignId,
      page = 1,
      limit = 20
    } = req.query;

    // Validate required parameters
    if (!brandId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameter: brandId'
      });
    }

    // Build query
    let query = supabase
      .from('rejected_influencers')
      .select(`
        *,
        influencer:influencers(name, platform, followers),
        brand:brands(name, industry),
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .eq('brand_id', brandId);

    // Add campaign filter if provided
    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    // Add pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1)
                 .order('rejected_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching rejected influencers:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch rejected influencers',
        error: error.message
      });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('rejected_influencers')
      .select('id', { count: 'exact' })
      .eq('brand_id', brandId);

    if (campaignId) {
      countQuery = countQuery.eq('campaign_id', campaignId);
    }

    const { count, error: countError } = await countQuery;

    if (countError) {
      console.error('Error counting rejected influencers:', countError);
    }

    res.json({
      success: true,
      message: 'Rejected influencers retrieved successfully',
      data: {
        rejectedInfluencers: data,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0
        }
      }
    });

  } catch (error) {
    console.error('Error in getRejectedInfluencers:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Check if an influencer is rejected for a specific campaign
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const checkRejectionStatus = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const { influencerId, brandId, campaignId } = req.query;

    // Validate required parameters
    if (!influencerId || !brandId || !campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: influencerId, brandId, campaignId'
      });
    }

    const { data, error } = await supabase
      .from('rejected_influencers')
      .select('rejected_at, rejection_reason')
      .eq('influencer_id', influencerId)
      .eq('brand_id', brandId)
      .eq('campaign_id', campaignId)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        message: 'Error checking rejection status',
        error: error.message
      });
    }

    // Check if there's a recent rejection (within 10 seconds)
    let cooldownInfo = null;
    if (data) {
      const rejectionTime = new Date(data.rejected_at);
      const cooldownEndTime = new Date(rejectionTime.getTime() + 10 * 1000); // 10 seconds
      const timeLeft = Math.max(0, cooldownEndTime.getTime() - Date.now());
      const isInCooldown = timeLeft > 0;
      
      if (isInCooldown) {
        const secondsLeft = Math.ceil(timeLeft / 1000);
        cooldownInfo = {
          isInCooldown: true,
          cooldownEndTime: cooldownEndTime.toISOString(),
          timeLeftMs: timeLeft,
          secondsLeft: secondsLeft
        };
      } else {
        cooldownInfo = {
          isInCooldown: false,
          cooldownEndTime: null,
          timeLeftMs: 0,
          secondsLeft: 0
        };
      }
    }

    res.json({
      success: true,
      message: 'Rejection status checked successfully',
      data: {
        isRejected: !!data,
        rejectedAt: data?.rejected_at || null,
        rejectionReason: data?.rejection_reason || null,
        cooldownInfo
      }
    });

  } catch (error) {
    console.error('Error in checkRejectionStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Remove an influencer from the rejected list (if they want to reapply)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeRejectedInfluencer = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const { id } = req.params;

    const { error } = await supabase
      .from('rejected_influencers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing rejected influencer:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to remove rejected influencer',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Rejected influencer removed successfully'
    });

  } catch (error) {
    console.error('Error in removeRejectedInfluencer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  addRejectedInfluencer,
  getRejectedInfluencers,
  checkRejectionStatus,
  removeRejectedInfluencer
}; 