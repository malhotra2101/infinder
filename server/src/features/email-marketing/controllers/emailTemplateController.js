/**
 * Email Template Controller
 * 
 * Handles CRUD operations for email templates used in sequences
 */

const { getServiceSupabase } = require('../../../config/supabase');

/**
 * Get all email templates
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmailTemplates = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { category } = req.query;

    let query = supabase
      .from('email_templates')
      .select('*')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('name', { ascending: true });

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch email templates',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email templates retrieved successfully',
      data: data || []
    });

  } catch (error) {
    console.error('Error in getEmailTemplates:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get email template by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmailTemplateById = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch email template',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email template retrieved successfully',
      data
    });

  } catch (error) {
    console.error('Error in getEmailTemplateById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Create new email template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createEmailTemplate = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const {
      name,
      category,
      subject_template,
      body_template,
      variables = {}
    } = req.body;

    // Validate required fields
    if (!name || !category || !subject_template || !body_template) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, category, subject_template, body_template'
      });
    }

    // Validate category
    const validCategories = ['initial', 'followup', 'reminder', 'final'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category. Must be one of: ' + validCategories.join(', ')
      });
    }

    const templateData = {
      name,
      category,
      subject_template,
      body_template,
      variables,
      is_active: true
    };

    const { data, error } = await supabase
      .from('email_templates')
      .insert([templateData])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create email template',
        error: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Email template created successfully',
      data
    });

  } catch (error) {
    console.error('Error in createEmailTemplate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update email template
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateEmailTemplate = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;
    const updateData = req.body;

    // Remove id and timestamps from update data
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.updated_at;

    // Add updated timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('email_templates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update email template',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email template updated successfully',
      data
    });

  } catch (error) {
    console.error('Error in updateEmailTemplate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete email template (soft delete)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteEmailTemplate = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Soft delete by setting is_active to false
    const { data, error } = await supabase
      .from('email_templates')
      .update({ 
        is_active: false,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete email template',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email template deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteEmailTemplate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Preview email template with sample data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const previewEmailTemplate = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;
    const { sampleData = {} } = req.body;

    // Get template
    const { data: template, error } = await supabase
      .from('email_templates')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email template not found'
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch email template',
        error: error.message
      });
    }

    // Default sample data
    const defaultSampleData = {
      influencer_name: 'Sarah Johnson',
      brand_name: 'Your Brand',
      campaign_name: 'Summer Collection 2024',
      influencer_platform: 'Instagram',
      influencer_followers: '50K',
      influencer_engagement: '3.2',
      campaign_budget: '$500-1000',
      campaign_duration: '2 weeks',
      campaign_description: 'Promote our new summer collection with authentic lifestyle content.',
      brand_contact_name: 'Marketing Team',
      unsubscribe_link: 'https://yourbrand.com/unsubscribe'
    };

    const mergedData = { ...defaultSampleData, ...sampleData };

    // Replace template variables
    let previewSubject = template.subject_template;
    let previewBody = template.body_template;

    Object.keys(mergedData).forEach(key => {
      const placeholder = `{${key}}`;
      previewSubject = previewSubject.replace(new RegExp(placeholder, 'g'), mergedData[key]);
      previewBody = previewBody.replace(new RegExp(placeholder, 'g'), mergedData[key]);
    });

    res.status(200).json({
      success: true,
      message: 'Email template preview generated',
      data: {
        template,
        preview: {
          subject: previewSubject,
          body: previewBody
        },
        sampleData: mergedData
      }
    });

  } catch (error) {
    console.error('Error in previewEmailTemplate:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  previewEmailTemplate
};
