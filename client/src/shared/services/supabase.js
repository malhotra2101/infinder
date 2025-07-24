import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * 
 * Centralized Supabase client for frontend data operations.
 * Handles influencer search, filtering, and data management.
 */

// Environment variables for Supabase configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase configuration. Please check your .env file.');
}

/**
 * Initialize Supabase client
 * @returns {Object} Supabase client instance
 */
const initializeSupabase = () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabase;
  } catch (error) {
    throw error;
  }
};

// Create and export the Supabase client instance
export const supabase = initializeSupabase();

/**
 * Test Supabase connection
 * @returns {Promise<boolean>} Connection status
 */
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('influencers').select('count').limit(1);
    if (error) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Fetch influencers with search and filters
 * @param {Object} params - Search parameters
 * @param {string} params.searchTerm - Search term
 * @param {Object} params.filters - Filter object
 * @param {number} params.page - Page number for pagination
 * @param {number} params.limit - Number of results per page
 * @returns {Promise<Object>} Search results
 */
export const searchInfluencers = async ({ searchTerm = '', filters = {}, page = 1, limit = 20 }) => {
  try {
    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' });

    // Apply search term filter
    if (searchTerm.trim()) {
      query = query.or(`name.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`);
    }

    // Apply platform filters
    if (filters.platforms && filters.platforms.length > 0) {
      query = query.in('platform', filters.platforms);
    }

    // Apply follower range filters
    if (filters.minFollowers) {
      query = query.gte('followers', filters.minFollowers);
    }
    if (filters.maxFollowers) {
      query = query.lte('followers', filters.maxFollowers);
    }

    // Apply engagement rate filters
    if (filters.minEngagement) {
      query = query.gte('engagement_rate', filters.minEngagement);
    }
    if (filters.maxEngagement) {
      query = query.lte('engagement_rate', filters.maxEngagement);
    }

    // Apply country filter
    if (filters.country) {
      query = query.eq('country', filters.country);
    }

    // Apply age group filters
    if (filters.ageGroups && filters.ageGroups.length > 0) {
      query = query.in('age_group', filters.ageGroups);
    }

    // Apply last active filter
    if (filters.lastActive) {
      const now = new Date();
      let cutoffDate;
      
      switch (filters.lastActive) {
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
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Apply sorting (default by engagement rate descending)
    query = query.order('engagement_rate', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return {
      data: data || [],
      count: count || 0,
      hasMore: data && data.length === limit,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch countries for filter dropdown
 * @returns {Promise<Array>} List of countries
 */
export const getCountries = async () => {
  try {
    const { data, error } = await supabase
      .from('countries')
      .select('name, code')
      .order('name');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    return [];
  }
};

/**
 * Add influencer to list
 * @param {Object} influencer - Influencer data
 * @param {string} listType - Type of list (selected, rejected)
 * @returns {Promise<Object>} Operation result
 */
export const addToList = async (influencer, listType) => {
  try {
    const { data, error } = await supabase
      .from('influencer_lists')
      .upsert({
        influencer_id: influencer.id,
        list_type: listType,
        added_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    throw error;
  }
};

/**
 * Get list counts for different categories
 * @returns {Promise<Object>} Counts for each list type
 */
export const getListCounts = async () => {
  try {
    const { data, error } = await supabase
      .from('influencer_lists')
      .select('list_type');

    if (error) {
      throw error;
    }

    const counts = {
      selected: 0,
      rejected: 0,
    };

    data?.forEach(item => {
      if (counts.hasOwnProperty(item.list_type)) {
        counts[item.list_type]++;
      }
    });

    return counts;
  } catch (error) {
    return { selected: 0, rejected: 0 };
  }
};

export default supabase; 