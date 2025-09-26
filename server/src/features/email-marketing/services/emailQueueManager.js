/**
 * Email Queue Manager
 * 
 * Handles automated email sending, scheduling, and queue processing
 */

const { getServiceSupabase } = require('../../../config/supabase');

class EmailQueueManager {
  constructor() {
    this.isProcessing = false;
    this.processingInterval = null;
  }

  /**
   * Start the queue processor
   * @param {number} intervalMs - Processing interval in milliseconds (default: 60000 = 1 minute)
   */
  start(intervalMs = 60000) {
    if (this.processingInterval) {
      this.stop();
    }

    console.log('📧 Email Queue Manager started');
    this.processingInterval = setInterval(() => {
      this.processQueue();
    }, intervalMs);

    // Process immediately on start
    this.processQueue();
  }

  /**
   * Stop the queue processor
   */
  stop() {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log('📧 Email Queue Manager stopped');
    }
  }

  /**
   * Process the email queue
   */
  async processQueue() {
    if (this.isProcessing) {
      return; // Prevent overlapping processing
    }

    this.isProcessing = true;
    
    try {
      const supabase = getServiceSupabase();
      const now = new Date().toISOString();

      // Simple query to avoid relationship errors - just get basic email jobs
      const { data: dueJobs, error } = await supabase
        .from('email_jobs')
        .select('*')
        .eq('status', 'scheduled')
        .lte('scheduled_at', now)
        .limit(10); // Process fewer in batches

      if (error) {
        console.error('Failed to fetch due email jobs:', error);
        return;
      }

      if (!dueJobs || dueJobs.length === 0) {
        return; // No jobs to process
      }

      console.log(`📧 Processing ${dueJobs.length} email jobs`);

      for (const job of dueJobs) {
        await this.processEmailJob(job);
      }

    } catch (error) {
      console.error('Error processing email queue:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Process a single email job
   * @param {Object} job - Email job data
   */
  async processEmailJob(job) {
    const supabase = getServiceSupabase();

    try {
      // Update job status to 'sending'
      await supabase
        .from('email_jobs')
        .update({ status: 'sending' })
        .eq('id', job.id);

      // Skip if sequence is not active
      if (job.email_sequences.status !== 'active') {
        await supabase
          .from('email_jobs')
          .update({ 
            status: 'cancelled',
            error_message: 'Sequence is not active'
          })
          .eq('id', job.id);
        return;
      }

      // Generate email content
      const emailContent = this.generateEmailContent(job);
      
      // For now, simulate sending (replace with actual email service)
      const emailResult = await this.sendEmail(emailContent);

      if (emailResult.success) {
        // Update job as sent
        await supabase
          .from('email_jobs')
          .update({
            status: 'sent',
            sent_at: new Date().toISOString(),
            email_provider_id: emailResult.messageId
          })
          .eq('id', job.id);

        // Update sequence statistics
        await supabase
          .from('email_sequences')
          .update({
            emails_sent: job.email_sequences.emails_sent + 1
          })
          .eq('id', job.sequence_id);

        // Update recipient progress
        await supabase
          .from('sequence_recipients')
          .update({
            current_step: job.sequence_steps.step_order,
            status: 'in_progress'
          })
          .eq('id', job.recipient_id);

        // Create tracking record
        await this.createTrackingRecord(job.id, 'sent');

        // Schedule next step if exists
        await this.scheduleNextStep(job);

        console.log(`✅ Email sent successfully: Job ${job.id}`);

      } else {
        // Update job as failed
        await supabase
          .from('email_jobs')
          .update({
            status: 'failed',
            error_message: emailResult.error,
            retry_count: job.retry_count + 1
          })
          .eq('id', job.id);

        // Retry logic (max 3 attempts)
        if (job.retry_count < 2) {
          // Reschedule for retry in 1 hour
          const retryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
          await supabase
            .from('email_jobs')
            .update({
              status: 'scheduled',
              scheduled_at: retryTime
            })
            .eq('id', job.id);
        }

        console.error(`❌ Email failed: Job ${job.id} - ${emailResult.error}`);
      }

    } catch (error) {
      console.error(`Error processing email job ${job.id}:`, error);
      
      // Update job as failed
      await supabase
        .from('email_jobs')
        .update({
          status: 'failed',
          error_message: error.message,
          retry_count: job.retry_count + 1
        })
        .eq('id', job.id);
    }
  }

  /**
   * Generate email content with variable substitution
   * @param {Object} job - Email job data
   * @returns {Object} Email content
   */
  generateEmailContent(job) {
    const influencer = job.sequence_recipients.influencers;
    const sequence = job.email_sequences;
    const step = job.sequence_steps;

    // Use custom content or template content
    let subject = job.subject || step.custom_subject || step.email_templates?.subject_template || 'No Subject';
    let body = job.body || step.custom_body || step.email_templates?.body_template || 'No Content';

    // Variable substitution
    const variables = {
      influencer_name: influencer.name,
      brand_name: 'Your Brand', // TODO: Get from brand data
      campaign_name: sequence.name,
      influencer_platform: influencer.platform,
      influencer_followers: influencer.followers,
      influencer_engagement: '3.2%', // TODO: Calculate actual engagement
      campaign_budget: '$500-1000', // TODO: Get from campaign data
      campaign_duration: '2 weeks', // TODO: Get from campaign data
      campaign_description: 'Amazing collaboration opportunity', // TODO: Get from campaign data
      brand_contact_name: 'Marketing Team', // TODO: Get from brand data
      unsubscribe_link: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/unsubscribe?seq=${job.sequence_id}&inf=${influencer.id}`
    };

    // Replace variables in subject and body
    Object.keys(variables).forEach(key => {
      const placeholder = `{${key}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), variables[key]);
      body = body.replace(new RegExp(placeholder, 'g'), variables[key]);
    });

    return {
      to: job.sequence_recipients.email,
      subject,
      body,
      tracking_id: this.generateTrackingId(job.id)
    };
  }

  /**
   * Send email (mock implementation - replace with actual email service)
   * @param {Object} emailContent - Email content
   * @returns {Object} Send result
   */
  async sendEmail(emailContent) {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock success (replace with actual email service like SendGrid)
    const success = Math.random() > 0.05; // 95% success rate

    if (success) {
      return {
        success: true,
        messageId: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
    } else {
      return {
        success: false,
        error: 'Mock email delivery failure'
      };
    }
  }

  /**
   * Schedule next step in sequence
   * @param {Object} job - Current email job
   */
  async scheduleNextStep(job) {
    const supabase = getServiceSupabase();

    try {
      // Find next step
      const { data: nextStep, error } = await supabase
        .from('sequence_steps')
        .select('*')
        .eq('sequence_id', job.sequence_id)
        .eq('step_order', job.sequence_steps.step_order + 1)
        .eq('is_active', true)
        .single();

      if (error && error.code === 'PGRST116') {
        // No next step, mark recipient as completed
        await supabase
          .from('sequence_recipients')
          .update({ status: 'completed' })
          .eq('id', job.recipient_id);
        return;
      }

      if (error) {
        console.error('Error finding next step:', error);
        return;
      }

      // Calculate next send time
      const now = new Date();
      const nextSendTime = new Date(
        now.getTime() + 
        (nextStep.delay_days * 24 * 60 * 60 * 1000) +
        (nextStep.delay_hours * 60 * 60 * 1000)
      );

      // Create next email job
      const nextJobData = {
        sequence_id: job.sequence_id,
        recipient_id: job.recipient_id,
        step_id: nextStep.id,
        scheduled_at: nextSendTime.toISOString(),
        status: 'scheduled',
        subject: nextStep.custom_subject,
        body: nextStep.custom_body
      };

      await supabase
        .from('email_jobs')
        .insert([nextJobData]);

      console.log(`📅 Next step scheduled for recipient ${job.recipient_id} at ${nextSendTime.toISOString()}`);

    } catch (error) {
      console.error('Error scheduling next step:', error);
    }
  }

  /**
   * Create tracking record
   * @param {number} emailJobId - Email job ID
   * @param {string} eventType - Event type
   */
  async createTrackingRecord(emailJobId, eventType) {
    const supabase = getServiceSupabase();

    try {
      await supabase
        .from('email_tracking')
        .insert([{
          email_job_id: emailJobId,
          tracking_id: this.generateTrackingId(emailJobId),
          event_type: eventType,
          event_data: {},
          occurred_at: new Date().toISOString()
        }]);
    } catch (error) {
      console.error('Error creating tracking record:', error);
    }
  }

  /**
   * Generate unique tracking ID
   * @param {number} jobId - Email job ID
   * @returns {string} Tracking ID
   */
  generateTrackingId(jobId) {
    return `track_${jobId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get queue statistics
   * @returns {Object} Queue stats
   */
  async getQueueStats() {
    const supabase = getServiceSupabase();

    try {
      const { data: stats, error } = await supabase
        .from('email_jobs')
        .select('status')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24 hours

      if (error) throw error;

      const summary = {
        scheduled: 0,
        sending: 0,
        sent: 0,
        failed: 0,
        cancelled: 0
      };

      stats.forEach(job => {
        summary[job.status] = (summary[job.status] || 0) + 1;
      });

      return summary;
    } catch (error) {
      console.error('Error getting queue stats:', error);
      return {};
    }
  }
}

// Create singleton instance
const emailQueueManager = new EmailQueueManager();

module.exports = emailQueueManager;
