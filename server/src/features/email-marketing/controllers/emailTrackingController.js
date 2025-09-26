/**
 * Email Tracking Controller
 * 
 * Handles email tracking events (opens, clicks, etc.)
 */

const { getServiceSupabase } = require('../../../config/supabase');

/**
 * Track email open
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const trackEmailOpen = async (req, res) => {
  try {
    const { tracking_id } = req.params;
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;

    if (!tracking_id) {
      return res.status(400).json({
        success: false,
        message: 'Tracking ID is required'
      });
    }

    const supabase = getServiceSupabase();

    // Check if this tracking ID exists and get the email job
    const { data: existingTracking, error: findError } = await supabase
      .from('email_tracking')
      .select(`
        *,
        email_jobs (
          id,
          sequence_id,
          email_sequences (
            id,
            opens
          )
        )
      `)
      .eq('tracking_id', tracking_id)
      .single();

    if (findError && findError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Invalid tracking ID'
      });
    }

    if (findError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to find tracking record',
        error: findError.message
      });
    }

    // Check if this is already tracked as opened
    const { data: openTracking, error: openError } = await supabase
      .from('email_tracking')
      .select('id')
      .eq('email_job_id', existingTracking.email_job_id)
      .eq('event_type', 'opened')
      .single();

    if (openError && openError.code !== 'PGRST116') {
      console.error('Error checking existing open tracking:', openError);
    }

    // If not already tracked as opened, record the open
    if (!openTracking) {
      // Create tracking record for open
      await supabase
        .from('email_tracking')
        .insert([{
          email_job_id: existingTracking.email_job_id,
          tracking_id: tracking_id,
          event_type: 'opened',
          event_data: {
            user_agent: userAgent,
            ip_address: ip,
            timestamp: new Date().toISOString()
          }
        }]);

      // Update sequence open count
      await supabase
        .from('email_sequences')
        .update({
          opens: (existingTracking.email_jobs.email_sequences.opens || 0) + 1
        })
        .eq('id', existingTracking.email_jobs.sequence_id);
    }

    // Return a 1x1 transparent pixel
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    
    res.set({
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    
    res.send(pixel);

  } catch (error) {
    console.error('Error in trackEmailOpen:', error);
    // Still return a pixel even on error
    const pixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    res.set('Content-Type', 'image/gif');
    res.send(pixel);
  }
};

/**
 * Track email click
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const trackEmailClick = async (req, res) => {
  try {
    const { tracking_id } = req.params;
    const { url } = req.query;
    const userAgent = req.get('User-Agent');
    const ip = req.ip || req.connection.remoteAddress;

    if (!tracking_id) {
      return res.status(400).json({
        success: false,
        message: 'Tracking ID is required'
      });
    }

    const supabase = getServiceSupabase();

    // Check if this tracking ID exists and get the email job
    const { data: existingTracking, error: findError } = await supabase
      .from('email_tracking')
      .select(`
        *,
        email_jobs (
          id,
          sequence_id,
          email_sequences (
            id,
            clicks
          )
        )
      `)
      .eq('tracking_id', tracking_id)
      .single();

    if (findError && findError.code === 'PGRST116') {
      return res.status(404).json({
        success: false,
        message: 'Invalid tracking ID'
      });
    }

    if (findError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to find tracking record',
        error: findError.message
      });
    }

    // Record the click
    await supabase
      .from('email_tracking')
      .insert([{
        email_job_id: existingTracking.email_job_id,
        tracking_id: tracking_id,
        event_type: 'clicked',
        event_data: {
          user_agent: userAgent,
          ip_address: ip,
          clicked_url: url,
          timestamp: new Date().toISOString()
        }
      }]);

    // Update sequence click count
    await supabase
      .from('email_sequences')
      .update({
        clicks: (existingTracking.email_jobs.email_sequences.clicks || 0) + 1
      })
      .eq('id', existingTracking.email_jobs.sequence_id);

    // Redirect to the target URL or return success
    if (url) {
      res.redirect(url);
    } else {
      res.status(200).json({
        success: true,
        message: 'Click tracked successfully'
      });
    }

  } catch (error) {
    console.error('Error in trackEmailClick:', error);
    
    // Still redirect if URL provided, otherwise return error
    const { url } = req.query;
    if (url) {
      res.redirect(url);
    } else {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
};

/**
 * Record influencer response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recordInfluencerResponse = async (req, res) => {
  try {
    const {
      sequence_id,
      influencer_id,
      email_job_id,
      response_type,
      message
    } = req.body;

    // Validate required fields
    if (!sequence_id || !influencer_id || !response_type) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: sequence_id, influencer_id, response_type'
      });
    }

    // Validate response type
    const validResponseTypes = ['reply', 'interested', 'not_interested', 'unsubscribe'];
    if (!validResponseTypes.includes(response_type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid response type. Must be one of: ' + validResponseTypes.join(', ')
      });
    }

    const supabase = getServiceSupabase();

    // Record the response
    const { data: response, error: responseError } = await supabase
      .from('influencer_responses')
      .insert([{
        sequence_id,
        influencer_id,
        email_job_id,
        response_type,
        message,
        response_date: new Date().toISOString(),
        processed: false
      }])
      .select()
      .single();

    if (responseError) {
      return res.status(500).json({
        success: false,
        message: 'Failed to record response',
        error: responseError.message
      });
    }

    // Update sequence reply count if it's a reply
    if (response_type === 'reply') {
      const { data: sequence, error: sequenceError } = await supabase
        .from('email_sequences')
        .select('replies')
        .eq('id', sequence_id)
        .single();

      if (!sequenceError) {
        await supabase
          .from('email_sequences')
          .update({ replies: (sequence.replies || 0) + 1 })
          .eq('id', sequence_id);
      }
    }

    // If unsubscribe, update recipient status
    if (response_type === 'unsubscribe') {
      await supabase
        .from('sequence_recipients')
        .update({ status: 'unsubscribed' })
        .eq('sequence_id', sequence_id)
        .eq('influencer_id', influencer_id);

      // Cancel any pending email jobs for this recipient
      await supabase
        .from('email_jobs')
        .update({ status: 'cancelled' })
        .eq('sequence_id', sequence_id)
        .in('status', ['scheduled', 'sending']);
    }

    res.status(201).json({
      success: true,
      message: 'Response recorded successfully',
      data: response
    });

  } catch (error) {
    console.error('Error in recordInfluencerResponse:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Handle unsubscribe request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleUnsubscribe = async (req, res) => {
  try {
    const { seq: sequence_id, inf: influencer_id } = req.query;

    if (!sequence_id || !influencer_id) {
      return res.status(400).send(`
        <html>
          <body>
            <h1>Invalid Unsubscribe Link</h1>
            <p>This unsubscribe link is invalid or has expired.</p>
          </body>
        </html>
      `);
    }

    const supabase = getServiceSupabase();

    // Record the unsubscribe response
    await supabase
      .from('influencer_responses')
      .insert([{
        sequence_id: parseInt(sequence_id),
        influencer_id: parseInt(influencer_id),
        response_type: 'unsubscribe',
        message: 'Unsubscribed via email link',
        response_date: new Date().toISOString(),
        processed: true
      }]);

    // Update recipient status
    await supabase
      .from('sequence_recipients')
      .update({ status: 'unsubscribed' })
      .eq('sequence_id', sequence_id)
      .eq('influencer_id', influencer_id);

    // Cancel pending jobs
    await supabase
      .from('email_jobs')
      .update({ status: 'cancelled' })
      .eq('sequence_id', sequence_id)
      .in('status', ['scheduled', 'sending']);

    // Return success page
    res.send(`
      <html>
        <head>
          <title>Unsubscribed Successfully</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; }
            .success { background: #d4edda; color: #155724; padding: 20px; border-radius: 8px; border: 1px solid #c3e6cb; }
          </style>
        </head>
        <body>
          <div class="success">
            <h1>✅ Unsubscribed Successfully</h1>
            <p>You have been successfully unsubscribed from this email sequence.</p>
            <p>You will no longer receive emails from this campaign.</p>
          </div>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('Error in handleUnsubscribe:', error);
    res.status(500).send(`
      <html>
        <body>
          <h1>Error</h1>
          <p>An error occurred while processing your unsubscribe request. Please try again later.</p>
        </body>
      </html>
    `);
  }
};

/**
 * Get tracking analytics for a sequence
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getTrackingAnalytics = async (req, res) => {
  try {
    const { sequence_id } = req.params;
    const supabase = getServiceSupabase();

    // Get all tracking events for the sequence
    const { data: events, error } = await supabase
      .from('email_tracking')
      .select(`
        *,
        email_jobs (
          sequence_id,
          recipient_id,
          sequence_recipients (
            influencer_id
          )
        )
      `)
      .eq('email_jobs.sequence_id', sequence_id)
      .order('occurred_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch tracking analytics',
        error: error.message
      });
    }

    // Process events into analytics
    const analytics = {
      total_events: events.length,
      events_by_type: {},
      timeline: [],
      recipient_activity: {}
    };

    events.forEach(event => {
      // Count by event type
      analytics.events_by_type[event.event_type] = 
        (analytics.events_by_type[event.event_type] || 0) + 1;

      // Add to timeline
      analytics.timeline.push({
        timestamp: event.occurred_at,
        event_type: event.event_type,
        influencer: event.email_jobs.sequence_recipients.influencers
      });

      // Track recipient activity
      const influencerId = event.email_jobs.sequence_recipients.influencer_id;
      if (!analytics.recipient_activity[influencerId]) {
        analytics.recipient_activity[influencerId] = {
          influencer: event.email_jobs.sequence_recipients.influencers,
          events: []
        };
      }
      analytics.recipient_activity[influencerId].events.push({
        type: event.event_type,
        timestamp: event.occurred_at,
        data: event.event_data
      });
    });

    res.status(200).json({
      success: true,
      message: 'Tracking analytics retrieved successfully',
      data: analytics
    });

  } catch (error) {
    console.error('Error in getTrackingAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  trackEmailOpen,
  trackEmailClick,
  recordInfluencerResponse,
  handleUnsubscribe,
  getTrackingAnalytics
};
