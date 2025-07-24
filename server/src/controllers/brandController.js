const { initializeSupabase } = require('../config/database');

/**
 * Brand Controller
 * Handles all brand-related operations
 */

/**
 * Get all brands with optional filtering
 */
const getAllBrands = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { 
      page = 1, 
      limit = 10, 
      industry, 
      search 
    } = req.query;

    let query = supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters
    if (industry) {
      query = query.eq('industry', industry);
    }
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: brands, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });

    res.json({
      brands,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get brand by ID
 */
const getBrandById = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = initializeSupabase();

    const { data: brand, error } = await supabase
      .from('brands')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Brand not found' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json({ brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



/**
 * Create new brand
 */
const createBrand = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const brandData = req.body;

    // Validate required fields
    if (!brandData.name) {
      return res.status(400).json({ error: 'Brand name is required' });
    }



    const { data: brand, error } = await supabase
      .from('brands')
      .insert(brandData)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Brand with this name already exists' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update brand
 */
const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = initializeSupabase();
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;

    const { data: brand, error } = await supabase
      .from('brands')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Brand not found' });
      }
      if (error.code === '23505') {
        return res.status(400).json({ error: 'Brand with this name already exists' });
      }
      return res.status(500).json({ error: error.message });
    }

    res.json({ brand });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Delete brand
 */
const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = initializeSupabase();

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get brand statistics
 */
const getBrandStats = async (req, res) => {
  try {
    const supabase = initializeSupabase();

    // Get various statistics
    const [
      { count: totalBrands },
      { count: brandsWithEmail },
      { count: brandsWithCampaigns }
    ] = await Promise.all([
      supabase.from('brands').select('*', { count: 'exact', head: true }),
      supabase.from('brands').select('*', { count: 'exact', head: true }).not('contact_email', 'is', null),
      supabase.from('brands').select('*', { count: 'exact', head: true }).gt('campaigns_count', 0)
    ]);

    // Get total campaigns
    const { data: campaignData } = await supabase
      .from('brands')
      .select('campaigns_count, active_campaigns, completed_campaigns');

    const totalCampaigns = campaignData?.reduce((sum, brand) => sum + (brand.campaigns_count || 0), 0) || 0;
    const totalActiveCampaigns = campaignData?.reduce((sum, brand) => sum + (brand.active_campaigns || 0), 0) || 0;
    const totalCompletedCampaigns = campaignData?.reduce((sum, brand) => sum + (brand.completed_campaigns || 0), 0) || 0;

    // Get industry distribution
    const { data: industryData } = await supabase
      .from('brands')
      .select('industry');

    const industryDistribution = {};
    industryData?.forEach(brand => {
      if (brand.industry) {
        industryDistribution[brand.industry] = (industryDistribution[brand.industry] || 0) + 1;
      }
    });

    res.json({
      stats: {
        totalBrands,
        brandsWithEmail,
        brandsWithCampaigns,
        totalCampaigns,
        totalActiveCampaigns,
        totalCompletedCampaigns,
        industryDistribution
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get brands by industry
 */
const getBrandsByIndustry = async (req, res) => {
  try {
    const { industry } = req.params;
    const supabase = initializeSupabase();

    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .eq('industry', industry)
      .order('name');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ brands });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get brands with most campaigns
 */
const getBrandsWithMostCampaigns = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const supabase = initializeSupabase();

    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .order('campaigns_count', { ascending: false })
      .limit(parseInt(limit));

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ brands });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Search brands
 */
const searchBrands = async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    const supabase = initializeSupabase();

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const { data: brands, error } = await supabase
      .from('brands')
      .select('*')
      .or(`name.ilike.%${q}%,description.ilike.%${q}%,industry.ilike.%${q}%`)
      .order('name')
      .limit(parseInt(limit));

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.json({ brands });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get brands with their active campaigns
 * This endpoint is specifically for influencers to discover brands and campaigns
 */
const getBrandsWithCampaigns = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { 
      page = 1, 
      limit = 10, 
      search, 
      platform, 
      industry, 
      status = 'active',
      minBudget,
      maxBudget
    } = req.query;

    // First, get all brands
    let brandsQuery = supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply brand filters
    if (search) {
      brandsQuery = brandsQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }
    if (industry) {
      brandsQuery = brandsQuery.eq('industry', industry);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    brandsQuery = brandsQuery.range(offset, offset + limit - 1);

    const { data: brands, error: brandsError } = await brandsQuery;

    if (brandsError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch brands',
        error: brandsError.message
      });
    }

    // For each brand, get their active campaigns
    const brandsWithCampaigns = [];
    
    for (const brand of brands) {
      let campaignsQuery = supabase
        .from('campaigns')
        .select('*')
        .eq('brand_name', brand.name);

      // Apply campaign filters
      if (status !== 'all') {
        campaignsQuery = campaignsQuery.eq('status', status);
      }
      if (platform) {
        campaignsQuery = campaignsQuery.eq('platform', platform);
      }
      if (minBudget) {
        campaignsQuery = campaignsQuery.gte('budget', minBudget);
      }
      if (maxBudget) {
        campaignsQuery = campaignsQuery.lte('budget', maxBudget);
      }

      const { data: campaigns, error: campaignsError } = await campaignsQuery;

      if (campaignsError) {
        console.error(`Error fetching campaigns for brand ${brand.name}:`, campaignsError);
        continue;
      }

      // Only include brands that have campaigns
      if (campaigns && campaigns.length > 0) {
        brandsWithCampaigns.push({
          brand: {
            id: brand.id,
            name: brand.name,
            industry: brand.industry,
            logo_url: brand.logo_url,
            description: brand.description
          },
          campaigns: campaigns.map(campaign => ({
            id: campaign.id,
            campaign_name: campaign.campaign_name,
            status: campaign.status,
            platform: campaign.platform,
            vertical: campaign.vertical,
            offer_description: campaign.offer_description,
            start_date: campaign.start_date,
            end_date: campaign.end_date,
            budget: campaign.budget,
            leadflow: campaign.leadflow
          }))
        });
      }
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('brands')
      .select('*', { count: 'exact', head: true });

    res.json({
      success: true,
      message: 'Brands with campaigns fetched successfully',
      data: {
        brands: brandsWithCampaigns,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalCount,
          hasMore: (parseInt(page) * parseInt(limit)) < totalCount
        }
      }
    });

  } catch (error) {
    console.error('Get brands with campaigns error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
  getBrandStats,
  getBrandsByIndustry,
  getBrandsWithMostCampaigns,
  searchBrands,
  getBrandsWithCampaigns
}; 