/**
 * Email Sequence Controller
 * 
 * Handles email sequence creation, management, and execution
 */

const { getServiceSupabase } = require('../../../config/supabase');

/**
 * Create new email sequence
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createEmailSequence = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const {
      brand_id,
      brand_name,
      campaign_id,
      name,
      steps = [],
      recipients = []
    } = req.body;

    // Validate required fields
    if (!campaign_id || !name || !steps.length || !recipients.length) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: campaign_id, name, steps, recipients'
      });
    }

    // Start transaction
    const { data: sequence, error: sequenceError } = await supabase
      .from('email_sequences')
      .insert([{
        brand_id,
        brand_name,
        campaign_id,
        name,
        total_recipients: recipients.length,
        status: 'draft'
      }])
      .select()
      .single();

    if (sequenceError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create email sequence',
        error: sequenceError.message
      });
    }

    // Create sequence steps
    const stepsWithSequenceId = steps.map((step, index) => ({
      sequence_id: sequence.id,
      step_order: index + 1,
      email_template_id: step.template_id || null,
      custom_subject: step.custom_subject || null,
      custom_body: step.custom_body || null,
      delay_days: step.delay_days || 0,
      delay_hours: step.delay_hours || 0,
      is_active: true
    }));

    const { data: sequenceSteps, error: stepsError } = await supabase
      .from('sequence_steps')
      .insert(stepsWithSequenceId)
      .select();

    if (stepsError) {
      // Rollback sequence creation
      await supabase.from('email_sequences').delete().eq('id', sequence.id);
      return res.status(500).json({
        success: false,
        message: 'Failed to create sequence steps',
        error: stepsError.message
      });
    }

    // Create sequence recipients
    const recipientsWithSequenceId = recipients.map(recipient => ({
      sequence_id: sequence.id,
      influencer_id: recipient.influencer_id,
      email: recipient.email,
      status: 'pending'
    }));

    const { data: sequenceRecipients, error: recipientsError } = await supabase
      .from('sequence_recipients')
      .insert(recipientsWithSequenceId)
      .select();

    if (recipientsError) {
      // Rollback sequence and steps creation
      await supabase.from('sequence_steps').delete().eq('sequence_id', sequence.id);
      await supabase.from('email_sequences').delete().eq('id', sequence.id);
      return res.status(500).json({
        success: false,
        message: 'Failed to create sequence recipients',
        error: recipientsError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Email sequence created successfully',
      data: {
        sequence,
        steps: sequenceSteps,
        recipients: sequenceRecipients
      }
    });

  } catch (error) {
    console.error('Error in createEmailSequence:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get email sequences for a brand
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmailSequences = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { brand_id } = req.params;
    const { status, campaign_id } = req.query;

    let query = supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_steps (
          id,
          step_order,
          email_template_id,
          custom_subject,
          custom_body,
          delay_days,
          delay_hours,
          is_active,
          email_templates (
            id,
            name,
            category
          )
        )
      `)
      .eq('brand_id', brand_id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (campaign_id) {
      query = query.eq('campaign_id', campaign_id);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch email sequences',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email sequences retrieved successfully',
      data: data || []
    });

  } catch (error) {
    console.error('Error in getEmailSequences:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get email sequence by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getEmailSequenceById = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_steps (
          id,
          step_order,
          email_template_id,
          custom_subject,
          custom_body,
          delay_days,
          delay_hours,
          is_active,
          email_templates (
            id,
            name,
            category,
            subject_template,
            body_template
          )
        ),
        sequence_recipients (
          id,
          influencer_id,
          email,
          status,
          current_step,
          added_at
        )
      `)
      .eq('id', id)
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email sequence not found'
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch email sequence',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email sequence retrieved successfully',
      data
    });

  } catch (error) {
    console.error('Error in getEmailSequenceById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Start email sequence
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const startEmailSequence = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Update sequence status to active
    const { data: sequence, error: updateError } = await supabase
      .from('email_sequences')
      .update({ 
        status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('status', 'draft') // Only allow starting draft sequences
      .select()
      .single();

    if (updateError && updateError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email sequence not found or already started'
      });
    }

    if (updateError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to start email sequence',
        error: updateError.message
      });
    }

    // Get sequence details for job creation
    const { data: sequenceData, error: fetchError } = await supabase
      .from('email_sequences')
      .select(`
        *,
        sequence_steps (
          id,
          step_order,
          email_template_id,
          custom_subject,
          custom_body,
          delay_days,
          delay_hours,
          is_active,
          email_templates (
            subject_template,
            body_template
          )
        ),
        sequence_recipients (
          id,
          influencer_id,
          email,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sequence data for job creation',
        error: fetchError.message
      });
    }

    // Create email jobs for the first step
    const firstStep = sequenceData.sequence_steps.find(step => step.step_order === 1);
    if (!firstStep) {
      return res.status(400).json({
        success: false,
        message: 'No first step found in sequence'
      });
    }

    const now = new Date();
    const emailJobs = sequenceData.sequence_recipients
      .filter(recipient => recipient.status === 'pending')
      .map(recipient => {
        const scheduledAt = new Date(now.getTime() + (firstStep.delay_days * 24 * 60 * 60 * 1000) + (firstStep.delay_hours * 60 * 60 * 1000));
        
        return {
          sequence_id: id,
          recipient_id: recipient.id,
          step_id: firstStep.id,
          scheduled_at: scheduledAt.toISOString(),
          status: 'scheduled',
          subject: firstStep.custom_subject || firstStep.email_templates?.subject_template || 'No subject',
          body: firstStep.custom_body || firstStep.email_templates?.body_template || 'No content'
        };
      });

    if (emailJobs.length > 0) {
      const { error: jobsError } = await supabase
        .from('email_jobs')
        .insert(emailJobs);

      if (jobsError) {
        console.error('Failed to create email jobs:', jobsError);
        // Don't fail the request, just log the error
      }
    }

    res.status(200).json({
      success: true,
      message: 'Email sequence started successfully',
      data: {
        sequence,
        jobs_created: emailJobs.length
      }
    });

  } catch (error) {
    console.error('Error in startEmailSequence:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Pause email sequence
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const pauseEmailSequence = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Update sequence status to paused
    const { data, error } = await supabase
      .from('email_sequences')
      .update({ 
        status: 'paused',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('status', 'active') // Only allow pausing active sequences
      .select()
      .single();

    if (error && error.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email sequence not found or not active'
      });
    }

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to pause email sequence',
        error: error.message
      });
    }

    // Cancel scheduled email jobs
    await supabase
      .from('email_jobs')
      .update({ status: 'cancelled' })
      .eq('sequence_id', id)
      .eq('status', 'scheduled');

    res.status(200).json({
      success: true,
      message: 'Email sequence paused successfully',
      data
    });

  } catch (error) {
    console.error('Error in pauseEmailSequence:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete email sequence
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteEmailSequence = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Delete sequence (cascade will handle related records)
    const { error } = await supabase
      .from('email_sequences')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete email sequence',
        error: error.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Email sequence deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteEmailSequence:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get sequence analytics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getSequenceAnalytics = async (req, res) => {
  try {
    const supabase = getServiceSupabase();
    const { id } = req.params;

    // Get sequence with analytics
    const { data: sequence, error: sequenceError } = await supabase
      .from('email_sequences')
      .select('*')
      .eq('id', id)
      .single();

    if (sequenceError && sequenceError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Email sequence not found'
      });
    }

    if (sequenceError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch sequence',
        error: sequenceError.message
      });
    }

    // Get detailed analytics from email_tracking
    const { data: trackingData, error: trackingError } = await supabase
      .from('email_tracking')
      .select(`
        event_type,
        occurred_at,
        email_jobs (
          sequence_id,
          step_id
        )
      `)
      .eq('email_jobs.sequence_id', id);

    if (trackingError) {
      console.error('Failed to fetch tracking data:', trackingError);
    }

    // Calculate analytics
    const analytics = {
      sequence,
      summary: {
        total_recipients: sequence.total_recipients,
        emails_sent: sequence.emails_sent,
        opens: sequence.opens,
        clicks: sequence.clicks,
        replies: sequence.replies,
        open_rate: sequence.emails_sent > 0 ? ((sequence.opens / sequence.emails_sent) * 100).toFixed(2) : 0,
        click_rate: sequence.emails_sent > 0 ? ((sequence.clicks / sequence.emails_sent) * 100).toFixed(2) : 0,
        reply_rate: sequence.emails_sent > 0 ? ((sequence.replies / sequence.emails_sent) * 100).toFixed(2) : 0
      },
      events: trackingData || []
    };

    res.status(200).json({
      success: true,
      message: 'Sequence analytics retrieved successfully',
      data: analytics
    });

  } catch (error) {
    console.error('Error in getSequenceAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createEmailSequence,
  getEmailSequences,
  getEmailSequenceById,
  startEmailSequence,
  pauseEmailSequence,
  deleteEmailSequence,
  getSequenceAnalytics
};
