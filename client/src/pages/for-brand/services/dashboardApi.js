import { supabase } from '../supabase';

/**
 * Dashboard API Service
 * Handles all dashboard data fetching from Supabase
 */

/**
 * Fetch dashboard metrics
 * @returns {Promise<Object>} Dashboard metrics
 */
export const getDashboardMetrics = async () => {
  try {
    const { data, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      throw error;
    }

    // If no metrics exist, calculate from other tables
    if (!data || data.length === 0) {
      return await calculateDashboardMetrics();
    }

    return data[0];
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw error;
  }
};

/**
 * Calculate dashboard metrics from other tables
 * @returns {Promise<Object>} Calculated metrics
 */
const calculateDashboardMetrics = async () => {
  try {
    // Get total revenue from influencer performance
    const { data: revenueData, error: revenueError } = await supabase
      .from('influencer_performance')
      .select('revenue');

    if (revenueError) throw revenueError;

    const totalRevenue = revenueData?.reduce((sum, item) => sum + (item.revenue || 0), 0) || 0;

    // Get active campaigns count
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('status', 'active');

    if (campaignsError) throw campaignsError;

    const totalCampaigns = campaignsData?.length || 0;

    // Get active influencers count
    const { data: influencersData, error: influencersError } = await supabase
      .from('influencers')
      .select('id')
      .eq('status', 'ACTIVE');

    if (influencersError) throw influencersError;

    const activeInfluencers = influencersData?.length || 0;

    // Calculate average engagement
    const { data: engagementData, error: engagementError } = await supabase
      .from('influencers')
      .select('engagement_rate')
      .not('engagement_rate', 'is', null);

    if (engagementError) throw engagementError;

    const avgEngagement = engagementData?.length > 0 
      ? engagementData.reduce((sum, item) => sum + (item.engagement_rate || 0), 0) / engagementData.length
      : 0;

    return {
      total_revenue: totalRevenue,
      total_campaigns: totalCampaigns,
      active_influencers: activeInfluencers,
      avg_engagement: avgEngagement
    };
  } catch (error) {
    console.error('Error calculating dashboard metrics:', error);
    throw error;
  }
};

/**
 * Fetch top performing influencers
 * @param {number} limit - Number of influencers to fetch
 * @returns {Promise<Array>} Top influencers
 */
export const getTopInfluencers = async (limit = 5) => {
  try {
    const { data, error } = await supabase
      .from('influencer_performance')
      .select(`
        revenue,
        engagement_rate,
        followers,
        influencers (
          id,
          name,
          avatar
        )
      `)
      .order('revenue', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data?.map(item => ({
      name: item.influencers?.name || 'Unknown',
      followers: item.followers || 0,
      engagement: item.engagement_rate || 0,
      revenue: item.revenue || 0,
      avatar: item.influencers?.avatar
    })) || [];
  } catch (error) {
    console.error('Error fetching top influencers:', error);
    throw error;
  }
};

/**
 * Fetch all influencers for the table
 * @param {Object} params - Query parameters
 * @param {string} params.search - Search term
 * @param {number} params.page - Page number
 * @param {number} params.rowsPerPage - Rows per page
 * @returns {Promise<Object>} Paginated influencers data
 */
export const getInfluencersTable = async ({ search = '', page = 1, rowsPerPage = 10 }) => {
  try {
    let query = supabase
      .from('influencers')
      .select('*', { count: 'exact' });

    // Apply search filter
    if (search.trim()) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,id.eq.${search}`);
    }

    // Apply pagination
    const from = (page - 1) * rowsPerPage;
    const to = from + rowsPerPage - 1;
    query = query.range(from, to);

    // Order by created_at descending
    query = query.order('created_at', { ascending: false });

    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    // Transform data to match the table structure
    const transformedData = data?.map(item => ({
      id: item.id,
      user: {
        name: item.name,
        email: item.email,
        avatar: item.avatar
      },
      balance: item.balance || 0,
      level: item.level || 'JUNIOR',
      backlog: item.backlog || 0,
      inProgress: item.in_progress || 0,
      done: item.done || 0,
      status: item.status || 'ACTIVE',
      created: new Date(item.created_at).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    })) || [];

    return {
      data: transformedData,
      count: count || 0,
      totalPages: Math.ceil((count || 0) / rowsPerPage)
    };
  } catch (error) {
    console.error('Error fetching influencers table:', error);
    throw error;
  }
};

/**
 * Fetch campaign analytics data
 * @returns {Promise<Object>} Campaign analytics data
 */
export const getCampaignAnalytics = async () => {
  try {
    // Get campaigns with performance data
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        id,
        name,
        budget,
        status,
        start_date,
        end_date,
        influencer_performance (
          revenue,
          engagement_rate
        )
      `)
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    // Transform data for charts
    const chartData = data?.map(campaign => {
      const totalRevenue = campaign.influencer_performance?.reduce((sum, perf) => sum + (perf.revenue || 0), 0) || 0;
      const avgEngagement = campaign.influencer_performance?.length > 0
        ? campaign.influencer_performance.reduce((sum, perf) => sum + (perf.engagement_rate || 0), 0) / campaign.influencer_performance.length
        : 0;

      return {
        name: campaign.name,
        budget: campaign.budget,
        revenue: totalRevenue,
        engagement: avgEngagement,
        roi: campaign.budget > 0 ? ((totalRevenue - campaign.budget) / campaign.budget) * 100 : 0
      };
    }) || [];

    return {
      campaigns: chartData,
      totalBudget: chartData.reduce((sum, campaign) => sum + (campaign.budget || 0), 0),
      totalRevenue: chartData.reduce((sum, campaign) => sum + (campaign.revenue || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    throw error;
  }
};

/**
 * Fetch revenue chart data
 * @returns {Promise<Array>} Revenue chart data
 */
export const getRevenueChartData = async () => {
  try {
    const { data, error } = await supabase
      .from('influencer_performance')
      .select(`
        revenue,
        month,
        year,
        influencers (
          name
        )
      `)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(12);

    if (error) {
      throw error;
    }

    // Group by month and calculate totals
    const monthlyData = {};
    data?.forEach(item => {
      const monthKey = `${item.year}-${item.month}`;
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = 0;
      }
      monthlyData[monthKey] += item.revenue || 0;
    });

    // Convert to array format for chart
    const chartData = Object.entries(monthlyData).map(([month, revenue]) => ({
      month: month,
      revenue: revenue
    })).sort((a, b) => a.month.localeCompare(b.month));

    return chartData;
  } catch (error) {
    console.error('Error fetching revenue chart data:', error);
    throw error;
  }
};

/**
 * Update influencer status
 * @param {number} influencerId - Influencer ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Update result
 */
export const updateInfluencerStatus = async (influencerId, status) => {
  try {
    const { data, error } = await supabase
      .from('influencers')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', influencerId)
      .select();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error updating influencer status:', error);
    throw error;
  }
};

/**
 * Delete influencer
 * @param {number} influencerId - Influencer ID
 * @returns {Promise<Object>} Delete result
 */
export const deleteInfluencer = async (influencerId) => {
  try {
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', influencerId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting influencer:', error);
    throw error;
  }
}; 