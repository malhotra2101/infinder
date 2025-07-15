/**
 * Influencer Controller
 * 
 * Handles all influencer-related API operations including
 * fetching, searching, filtering, and managing influencer data.
 */

const { initializeSupabase } = require('../config/database');

// Mock data as fallback when database is unavailable
const mockInfluencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    bio: "Lifestyle & fashion influencer sharing daily inspiration and style tips",
    category: "Lifestyle & Fashion",
    platform: "Instagram",
    followers: 234000,
    engagement_rate: 4.2,
    country: "United States",
    age_group: "25-34",
    last_active: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Tech enthusiast and software developer sharing coding tutorials and tech reviews",
    category: "Technology",
    platform: "YouTube",
    followers: 456000,
    engagement_rate: 6.8,
    country: "Canada",
    age_group: "18-24",
    last_active: "2024-01-14T15:45:00Z"
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Fitness coach helping people achieve their health goals through sustainable workouts",
    category: "Fitness & Wellness",
    platform: "TikTok",
    followers: 789000,
    engagement_rate: 8.3,
    country: "Spain",
    age_group: "25-34",
    last_active: "2024-01-15T08:20:00Z"
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Food blogger and chef sharing delicious recipes and cooking techniques",
    category: "Food & Cooking",
    platform: "Instagram",
    followers: 345000,
    engagement_rate: 5.1,
    country: "South Korea",
    age_group: "35-44",
    last_active: "2024-01-13T19:10:00Z"
  },
  {
    id: 5,
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    bio: "Travel vlogger exploring the world and sharing amazing destinations",
    category: "Travel",
    platform: "YouTube",
    followers: 567000,
    engagement_rate: 7.2,
    country: "Australia",
    age_group: "25-34",
    last_active: "2024-01-15T12:00:00Z"
  },
  {
    id: 6,
    name: "James Thompson",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    bio: "Gaming content creator streaming live gameplay and sharing gaming tips",
    category: "Gaming",
    platform: "Twitch",
    followers: 123000,
    engagement_rate: 3.8,
    country: "United Kingdom",
    age_group: "18-24",
    last_active: "2024-01-14T22:30:00Z"
  },
  {
    id: 7,
    name: "Sophie Martin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    bio: "Beauty influencer sharing makeup tutorials and skincare routines",
    category: "Beauty",
    platform: "Instagram",
    followers: 678000,
    engagement_rate: 6.5,
    country: "Brazil",
    age_group: "18-24",
    last_active: "2024-01-15T09:15:00Z"
  },
  {
    id: 8,
    name: "Carlos Silva",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
    bio: "Business consultant sharing entrepreneurship tips and success strategies",
    category: "Business",
    platform: "LinkedIn",
    followers: 89000,
    engagement_rate: 4.9,
    country: "Brazil",
    age_group: "35-44",
    last_active: "2024-01-14T16:45:00Z"
  },
  {
    id: 9,
    name: "Lisa Wang",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
    bio: "Fashion designer showcasing latest trends and styling advice",
    category: "Fashion",
    platform: "Instagram",
    followers: 456000,
    engagement_rate: 5.7,
    country: "Japan",
    age_group: "25-34",
    last_active: "2024-01-15T11:20:00Z"
  },
  {
    id: 10,
    name: "Michael Brown",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Tech reviewer and gadget enthusiast sharing the latest in technology",
    category: "Technology",
    platform: "YouTube",
    followers: 234000,
    engagement_rate: 4.3,
    country: "United States",
    age_group: "25-34",
    last_active: "2024-01-13T14:30:00Z"
  }
];

/**
 * Get all influencers with optional filtering and pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencers = async (req, res) => {
  try {
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
      lastActive
    } = req.query;

    // Try to get data from Supabase first
    try {
      const supabase = initializeSupabase();
      
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

      // Apply sorting (default by engagement rate descending)
      query = query.order('engagement_rate', { ascending: false });

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      res.json({
        success: true,
        data: data || [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || 0,
          totalPages: Math.ceil((count || 0) / parseInt(limit)),
          hasMore: data && data.length === parseInt(limit)
        }
      });
      return;
    } catch (dbError) {
      console.log('Database connection failed, using mock data:', dbError.message);
      // Fall back to mock data
    }

    // Use mock data when database is unavailable
    let filteredData = [...mockInfluencers];

    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(influencer => 
        influencer.name.toLowerCase().includes(searchLower) ||
        influencer.bio.toLowerCase().includes(searchLower) ||
        influencer.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply platform filter
    if (platform) {
      filteredData = filteredData.filter(influencer => 
        influencer.platform.toLowerCase() === platform.toLowerCase()
      );
    }

    // Apply follower range filters
    if (minFollowers) {
      filteredData = filteredData.filter(influencer => 
        influencer.followers >= parseInt(minFollowers)
      );
    }
    if (maxFollowers) {
      filteredData = filteredData.filter(influencer => 
        influencer.followers <= parseInt(maxFollowers)
      );
    }

    // Apply engagement rate filters
    if (minEngagement) {
      filteredData = filteredData.filter(influencer => 
        influencer.engagement_rate >= parseFloat(minEngagement)
      );
    }
    if (maxEngagement) {
      filteredData = filteredData.filter(influencer => 
        influencer.engagement_rate <= parseFloat(maxEngagement)
      );
    }

    // Apply country filter
    if (country) {
      filteredData = filteredData.filter(influencer => 
        influencer.country.toLowerCase() === country.toLowerCase()
      );
    }

    // Apply age group filter
    if (ageGroup) {
      filteredData = filteredData.filter(influencer => 
        influencer.age_group === ageGroup
      );
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
        filteredData = filteredData.filter(influencer => 
          new Date(influencer.last_active) >= cutoffDate
        );
      }
    }

    // Sort by engagement rate (descending)
    filteredData.sort((a, b) => b.engagement_rate - a.engagement_rate);

    // Apply pagination
    const from = (parseInt(page) - 1) * parseInt(limit);
    const to = from + parseInt(limit);
    const paginatedData = filteredData.slice(from, to);

    res.json({
      success: true,
      data: paginatedData,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / parseInt(limit)),
        hasMore: to < filteredData.length
      }
    });
  } catch (error) {
    console.error('Error fetching influencers:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencers',
      message: error.message
    });
  }
};

/**
 * Get a single influencer by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencerById = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Influencer not found'
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Error fetching influencer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch influencer',
      message: error.message
    });
  }
};

/**
 * Get available countries for filtering
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCountries = async (req, res) => {
  try {
    const supabase = initializeSupabase();

    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    console.error('Error fetching countries:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch countries',
      message: error.message
    });
  }
};

/**
 * Add influencer to a list (selected, rejected, etc.)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addToList = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { influencerId, listType } = req.body;

    if (!influencerId || !listType) {
      return res.status(400).json({
        success: false,
        error: 'Influencer ID and list type are required'
      });
    }

    // Use upsert to either insert new record or update existing one
    // This ensures each influencer can only be in one list at a time
    const { data, error } = await supabase
      .from('influencer_lists')
      .upsert({
        influencer_id: influencerId,
        list_type: listType,
        added_at: new Date().toISOString()
      }, {
        onConflict: 'influencer_id',
        ignoreDuplicates: false
      });

    if (error) {
      console.error('Error adding to list:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to add influencer to list',
        details: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: `Influencer added to ${listType} list successfully`,
      data: data
    });

  } catch (error) {
    console.error('Error adding to list:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};

/**
 * Get influencers by list type (selected/rejected)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getInfluencersByListType = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { type } = req.params;
    if (!['selected', 'rejected'].includes(type)) {
      return res.status(400).json({ success: false, error: 'Invalid list type' });
    }
    // Get influencer_ids from influencer_lists
    const { data: listData, error: listError } = await supabase
      .from('influencer_lists')
      .select('influencer_id')
      .eq('list_type', type);
    if (listError) throw listError;
    const influencerIds = listData.map(item => item.influencer_id);
    if (influencerIds.length === 0) {
      return res.json({ success: true, data: [] });
    }
    // Fetch influencers by IDs
    const { data: influencers, error: infError } = await supabase
      .from('influencers')
      .select('*')
      .in('id', influencerIds);
    if (infError) throw infError;
    res.json({ success: true, data: influencers });
  } catch (error) {
    console.error('Error fetching influencers by list type:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch influencers by list', message: error.message });
  }
};

/**
 * Get counts of influencers by list type
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getListCounts = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    // Get counts for selected and rejected lists
    const { count: selectedCount, error: selectedError } = await supabase
      .from('influencer_lists')
      .select('*', { count: 'exact', head: true })
      .eq('list_type', 'selected');
    
    if (selectedError) throw selectedError;
    
    const { count: rejectedCount, error: rejectedError } = await supabase
      .from('influencer_lists')
      .select('*', { count: 'exact', head: true })
      .eq('list_type', 'rejected');
    
    if (rejectedError) throw rejectedError;
    
    res.json({
      success: true,
      data: {
        selected: selectedCount || 0,
        rejected: rejectedCount || 0
      }
    });
  } catch (error) {
    console.error('Error fetching list counts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch list counts',
      message: error.message
    });
  }
};

/**
 * Remove influencer from a list (selected, rejected, etc.)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removeFromList = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { influencerId, listType } = req.body;

    if (!influencerId || !listType) {
      return res.status(400).json({
        success: false,
        error: 'Influencer ID and list type are required'
      });
    }

    const { error } = await supabase
      .from('influencer_lists')
      .delete()
      .eq('influencer_id', influencerId)
      .eq('list_type', listType);

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: `Influencer removed from ${listType} list`
    });
  } catch (error) {
    console.error('Error removing from list:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from list',
      message: error.message
    });
  }
};

/**
 * Reset all influencer lists (clear selected and rejected)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const resetLists = async (req, res) => {
  try {
    const supabase = initializeSupabase();

    // Delete all entries from influencer_lists table
    const { error } = await supabase
      .from('influencer_lists')
      .delete()
      .neq('id', 0); // Delete all records

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      message: 'All influencer lists have been reset',
      data: {
        selected: 0,
        rejected: 0
      }
    });
  } catch (error) {
    console.error('Error resetting lists:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reset lists',
      message: error.message
    });
  }
};

module.exports = {
  getInfluencers,
  getInfluencerById,
  getCountries,
  addToList,
  getInfluencersByListType,
  getListCounts,
  removeFromList,
  resetLists
}; 