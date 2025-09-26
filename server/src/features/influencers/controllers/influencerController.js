/**
 * Influencer Controller
 * 
 * Handles all influencer-related operations including
 * creating, reading, updating, and deleting influencers.
 * 
 * TODO: Update this controller to work with the new database design
 */

// All create/update/delete operations removed per new design

/**
 * Get all influencers with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const { getServiceSupabase } = require('../../../config/supabase');

const getInfluencers = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const {
      platform,
      country,
      minFollowers,
      maxFollowers,
      page = 1,
      limit = 20,
      search,
    } = req.query;

    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit) - 1;

    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' })
      .order('id', { ascending: true })
      .range(from, to);

    // Note: current schema does not have platform/country columns; left for future extension
    // if (platform) query = query.eq('platform', platform);
    // if (country) query = query.eq('country', country);

    // Followers are stored as text (followers_count). Numeric range filtering is not reliable server-side without casting.
    // For now, fetch the page and apply numeric filtering after mapping.

    if (search && search.trim()) {
      // Search across full_name, username and bio
      query = query.or(`full_name.ilike.%${search}%,username.ilike.%${search}%,bio.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch influencers', error: error.message });
    }

    // Map DB rows to client-expected shape
    const mapInfluencer = (row) => {
      // followers_count can contain formatted strings, extract digits
      const numericFollowers = typeof row.followers_count === 'string'
        ? parseInt((row.followers_count.match(/\d+/g) || []).join('')) || 0
        : (typeof row.followers_count === 'number' ? row.followers_count : 0);

      return {
        // keep original fields
        ...row,
        // normalized fields expected by client
        name: row.full_name || row.username || null,
        followers: numericFollowers,
        engagement_rate: typeof row.engagement_avg === 'number' ? row.engagement_avg : 0,
      };
    };

    let mapped = (data || []).map(mapInfluencer);

    // Apply numeric filters client-side if provided
    if (minFollowers) {
      const minF = parseInt(minFollowers);
      if (!Number.isNaN(minF)) {
        mapped = mapped.filter((r) => (r.followers || 0) >= minF);
      }
    }
    if (maxFollowers) {
      const maxF = parseInt(maxFollowers);
      if (!Number.isNaN(maxF)) {
        mapped = mapped.filter((r) => (r.followers || 0) <= maxF);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Influencers retrieved successfully',
      data: {
        data: mapped,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          hasMore: from + (mapped?.length || 0) < (count || 0)
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};

/**
 * Get a single influencer by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencerById = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({ success: false, message: 'Influencer not found' });
    }
    if (error) {
      return res.status(500).json({ success: false, message: 'Failed to fetch influencer', error: error.message });
    }

    // Map DB row to client-expected shape
    const numericFollowers = typeof data.followers_count === 'string'
      ? parseInt((data.followers_count.match(/\d+/g) || []).join('')) || 0
      : (typeof data.followers_count === 'number' ? data.followers_count : 0);

    const mapped = {
      ...data,
      name: data.full_name || data.username || null,
      followers: numericFollowers,
      engagement_rate: typeof data.engagement_avg === 'number' ? data.engagement_avg : 0,
    };

    res.status(200).json({
      success: true,
      message: 'Influencer retrieved successfully',
      data: mapped
    });
  } catch (error) {
    console.error('Error in getInfluencerById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// Update/delete/search/stats endpoints removed per new design

//

//

//

module.exports = {
  getInfluencers,
  getInfluencerById,
};