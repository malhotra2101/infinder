/**
 * Collaboration Controller
 * 
 * Handles all collaboration request operations including
 * creating, reading, updating, and deleting bidirectional requests.
 */

const { initializeSupabase } = require('../config/database');

/**
 * Create a new collaboration request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createCollaborationRequest = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      senderType,
      senderId,
      receiverType,
      receiverId,
      campaignId,
      requestType = 'collaboration'
    } = req.body;

    // Validate required fields
    if (!senderType || !senderId || !receiverType || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: senderType, senderId, receiverType, receiverId'
      });
    }

    // Validate sender and receiver types
    const validTypes = ['brand', 'influencer'];
    if (!validTypes.includes(senderType) || !validTypes.includes(receiverType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sender or receiver type. Must be "brand" or "influencer"'
      });
    }

    // Validate request types
    const validRequestTypes = ['collaboration', 'campaign_assignment'];
    if (!validRequestTypes.includes(requestType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request type. Must be "collaboration" or "campaign_assignment"'
      });
    }

    // For campaign assignments, campaignId is required
    if (requestType === 'campaign_assignment' && !campaignId) {
      return res.status(400).json({
        success: false,
        message: 'Campaign ID is required for campaign assignment requests'
      });
    }

    // If this is an influencer applying to a campaign, check if they're already selected or recently rejected
    if (senderType === 'influencer' && campaignId) {
      const { data: selectedInfluencer, error: selectedError } = await supabase
        .from('influencer_lists')
        .select('id')
        .eq('influencer_id', senderId)
        .eq('campaign_id', campaignId)
        .eq('list_type', 'selected')
        .single();

      if (selectedError && selectedError.code !== 'PGRST116') {
        return res.status(500).json({
          success: false,
          message: 'Error checking if influencer is already selected',
          error: selectedError.message
        });
      }

      if (selectedInfluencer) {
        return res.status(409).json({
          success: false,
          message: 'You are already selected for this campaign and cannot apply again'
        });
      }

      // Check if recently rejected (within 10 seconds)
      const tenSecondsAgo = new Date(Date.now() - 10 * 1000).toISOString();
      const { data: recentRejection, error: rejectionError } = await supabase
        .from('rejected_influencers')
        .select('rejected_at')
        .eq('influencer_id', senderId)
        .eq('brand_id', receiverId)
        .eq('campaign_id', campaignId)
        .gte('rejected_at', tenSecondsAgo)
        .single();

      if (rejectionError && rejectionError.code !== 'PGRST116') {
        return res.status(500).json({
          success: false,
          message: 'Error checking recent rejection status',
          error: rejectionError.message
        });
      }

      if (recentRejection) {
        const rejectionTime = new Date(recentRejection.rejected_at);
        const cooldownEndTime = new Date(rejectionTime.getTime() + 10 * 1000); // 10 seconds
        const timeLeft = Math.max(0, cooldownEndTime.getTime() - Date.now());
        const secondsLeft = Math.ceil(timeLeft / 1000);
        
        return res.status(429).json({
          success: false,
          message: 'You were recently rejected for this campaign. Please wait before applying again.',
          data: {
            cooldownEndTime: cooldownEndTime.toISOString(),
            timeLeftMs: timeLeft,
            secondsLeft: secondsLeft
          }
        });
      }
    }

    // Check if request already exists (including campaign_id for campaign assignments)
    // For campaign-related requests, check both 'collaboration' and 'campaign_assignment' types
    let query = supabase
      .from('collaboration_requests')
      .select('id')
      .eq('sender_type', senderType)
      .eq('sender_id', senderId)
      .eq('receiver_type', receiverType)
      .eq('receiver_id', receiverId);
    
    // If there's a campaign_id, check for both request types
    if (campaignId) {
      query = query.eq('campaign_id', campaignId)
                   .in('request_type', ['collaboration', 'campaign_assignment']);
    } else {
      // For non-campaign requests, check the specific request type
      query = query.eq('request_type', requestType);
    }
    
    const { data: existingRequest, error: checkError } = await query.single();

    if (checkError && checkError.code !== 'PGRST116') {
      return res.status(500).json({
        success: false,
        message: 'Error checking existing request',
        error: checkError.message
      });
    }

    if (existingRequest) {
      return res.status(409).json({
        success: false,
        message: campaignId 
          ? `You have already applied to this campaign (${campaignId})` 
          : 'Collaboration request already exists'
      });
    }

    // Create request data object
    const requestData = {
      sender_type: senderType,
      sender_id: senderId,
      receiver_type: receiverType,
      receiver_id: receiverId,
      campaign_id: campaignId || null,
      request_type: requestType
    };

    // Insert request into database
    const { data, error } = await supabase
      .from('collaboration_requests')
      .insert([requestData])
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `);

    if (error) {
      console.error('Error creating collaboration request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to create collaboration request',
        error: error.message
      });
    }

    // Broadcast real-time update
    if (global.broadcastToChannel) {
      global.broadcastToChannel('collaboration', {
        type: 'collaboration_request',
        payload: {
          action: 'created',
          request: data[0]
        }
      });
    }

    res.status(201).json({
      success: true,
      message: 'Collaboration request created successfully',
      data: data[0]
    });

  } catch (error) {
    console.error('Error in createCollaborationRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get collaboration requests for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getUserRequests = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    
    const {
      userType,
      userId,
      filter = 'all',
      page = 1,
      limit = 20
    } = req.query;

    // Validate required parameters
    if (!userType || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userType, userId'
      });
    }

    // Validate user type
    const validTypes = ['brand', 'influencer'];
    if (!validTypes.includes(userType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user type. Must be "brand" or "influencer"'
      });
    }

    // Validate filter
    const validFilters = ['all', 'sent', 'received'];
    if (!validFilters.includes(filter)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid filter. Must be "all", "sent", or "received"'
      });
    }

    let query = supabase
      .from('collaboration_requests')
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .order('created_at', { ascending: false });

    // Apply filters based on user type and filter parameter
    if (filter === 'sent') {
      query = query.eq('sender_type', userType).eq('sender_id', userId);
    } else if (filter === 'received') {
      query = query.eq('receiver_type', userType).eq('receiver_id', userId);
    } else {
      // 'all' - get both sent and received
      query = query.or(`sender_type.eq.${userType},sender_id.eq.${userId},receiver_type.eq.${userType},receiver_id.eq.${userId}`);
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching collaboration requests:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collaboration requests',
        error: error.message
      });
    }

    // Add direction information to each request
    const requestsWithDirection = data.map(request => ({
      ...request,
      direction: request.sender_type === userType && request.sender_id === parseInt(userId) ? 'sent' : 'received'
    }));

    res.json({
      success: true,
      data: {
        requests: requestsWithDirection,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count || data.length
        }
      }
    });

  } catch (error) {
    console.error('Error in getUserRequests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get a specific collaboration request by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCollaborationRequestById = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { data, error } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status, offer_description, start_date, end_date)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Collaboration request not found'
        });
      }
      console.error('Error fetching collaboration request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collaboration request',
        error: error.message
      });
    }

    res.json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Error in getCollaborationRequestById:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Update collaboration request status
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const updateCollaborationRequestStatus = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'accepted', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be one of: pending, accepted, rejected, completed'
      });
    }

    // First, get the current request to check if it's a campaign assignment
    const { data: currentRequest, error: fetchError } = await supabase
      .from('collaboration_requests')
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          message: 'Collaboration request not found'
        });
      }
      console.error('Error fetching collaboration request:', fetchError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collaboration request',
        error: fetchError.message
      });
    }

    // Update the collaboration request status
    const { data, error } = await supabase
      .from('collaboration_requests')
      .update({ status })
      .eq('id', id)
      .select(`
        *,
        campaign:campaigns(campaign_name, brand_name, platform, status)
      `)
      .single();

    if (error) {
      console.error('Error updating collaboration request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to update collaboration request',
        error: error.message
      });
    }

    // If status is 'accepted', handle the acceptance logic
    if (status === 'accepted') {
      try {
        console.log(`🔍 Processing acceptance for request ID: ${id}`);
        console.log(`📋 Request details:`, {
          sender_type: currentRequest.sender_type,
          sender_id: currentRequest.sender_id,
          receiver_type: currentRequest.receiver_type,
          receiver_id: currentRequest.receiver_id,
          campaign_id: currentRequest.campaign_id,
          request_type: currentRequest.request_type
        });

        // Determine which influencer ID to use based on sender/receiver types
        let influencerId, campaignId;
        
        if (currentRequest.sender_type === 'influencer') {
          influencerId = currentRequest.sender_id;
        } else if (currentRequest.receiver_type === 'influencer') {
          influencerId = currentRequest.receiver_id;
        } else {
          console.error('No influencer found in collaboration request');
          return res.status(400).json({
            success: false,
            message: 'Invalid collaboration request: no influencer found'
          });
        }

        campaignId = currentRequest.campaign_id;
        console.log(`👤 Influencer ID: ${influencerId}, Campaign ID: ${campaignId}`);

        // Check if influencer is already selected for this specific campaign
        const { data: existingEntry, error: checkError } = await supabase
          .from('influencer_lists')
          .select('id')
          .eq('influencer_id', influencerId)
          .eq('campaign_id', campaignId)
          .eq('list_type', 'selected')
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing entry:', checkError);
          return res.status(500).json({
            success: false,
            message: 'Failed to check existing entry',
            error: checkError.message
          });
        }

        if (existingEntry) {
          console.log(`✅ Influencer ${influencerId} already selected for campaign ${campaignId}`);
        } else {
          console.log(`➕ Adding influencer ${influencerId} to selected list for campaign ${campaignId}`);
          
          // Add to influencer_lists with campaign_id
          const { error: listError } = await supabase
            .from('influencer_lists')
            .insert({
              influencer_id: influencerId,
              list_type: 'selected',
              campaign_id: campaignId,
              added_at: new Date().toISOString()
            });

          if (listError) {
            console.error('Error adding to influencer_lists:', listError);
            return res.status(500).json({
              success: false,
              message: 'Failed to add influencer to selected list',
              error: listError.message
            });
          } else {
            console.log(`✅ Successfully added influencer ${influencerId} to selected list for campaign ${campaignId}`);
          }
        }

        // Check for other pending requests from the same influencer for different campaigns
        const { data: otherRequests, error: otherRequestsError } = await supabase
          .from('collaboration_requests')
          .select('id, campaign_id, status')
          .eq('sender_id', influencerId)
          .eq('sender_type', 'influencer')
          .eq('status', 'pending');

        if (!otherRequestsError && otherRequests) {
          console.log(`📋 Other pending requests for influencer ${influencerId}:`, otherRequests);
          
          // Verify that we're not accidentally affecting other requests
          const otherCampaignRequests = otherRequests.filter(req => req.campaign_id !== campaignId);
          if (otherCampaignRequests.length > 0) {
            console.log(`⚠️ Found ${otherCampaignRequests.length} other pending requests for different campaigns:`, otherCampaignRequests);
          }
        }

        // Delete the collaboration request since the influencer has been selected
        const { error: deleteError } = await supabase
          .from('collaboration_requests')
          .delete()
          .eq('id', id);

        if (deleteError) {
          console.error('Error deleting collaboration request:', deleteError);
          return res.status(500).json({
            success: false,
            message: 'Failed to delete collaboration request after acceptance',
            error: deleteError.message
          });
        } else {
          console.log(`🗑️ Collaboration request ${id} deleted after acceptance`);
        }

        // Return success response with the acceptance data
        return res.json({
          success: true,
          message: 'Collaboration request accepted and influencer added to selected list',
          data: {
            id: id,
            action: 'accepted_and_deleted',
            influencerId: influencerId,
            campaignId: campaignId,
            message: 'Influencer has been accepted and moved to selected list'
          }
        });

      } catch (operationError) {
        console.error('Error in post-acceptance operations:', operationError);
        return res.status(500).json({
          success: false,
          message: 'Failed to complete acceptance process',
          error: operationError.message
        });
      }
    }

    // If status is 'rejected', handle the rejection logic
    if (status === 'rejected') {
      try {
        // Check if this influencer is already rejected for this campaign
        const { data: existingRejection, error: checkError } = await supabase
          .from('rejected_influencers')
          .select('id')
          .eq('influencer_id', data.sender_id)
          .eq('brand_id', data.receiver_id)
          .eq('campaign_id', data.campaign_id)
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking existing rejection:', checkError);
          return res.status(500).json({
            success: false,
            message: 'Failed to check existing rejection',
            error: checkError.message
          });
        }

        if (existingRejection) {
          // Update existing rejection record
          const { error: updateError } = await supabase
            .from('rejected_influencers')
            .update({
              collaboration_request_id: id,
              rejection_reason: req.body.rejectionReason || null,
              rejected_at: new Date().toISOString()
            })
            .eq('id', existingRejection.id);

          if (updateError) {
            console.error('Error updating existing rejection:', updateError);
            return res.status(500).json({
              success: false,
              message: 'Failed to update existing rejection',
              error: updateError.message
            });
          }
        } else {
          // Add new rejection record
          const { error: addRejectionError } = await supabase
            .from('rejected_influencers')
            .insert([{
              influencer_id: data.sender_id,
              brand_id: data.receiver_id,
              campaign_id: data.campaign_id,
              collaboration_request_id: id,
              rejection_reason: req.body.rejectionReason || null
            }]);

          if (addRejectionError) {
            console.error('Error adding to rejected_influencers:', addRejectionError);
            return res.status(500).json({
              success: false,
              message: 'Failed to add influencer to rejected list',
              error: addRejectionError.message
            });
          }
        }

        // Then delete the collaboration request completely
        const { error: deleteError } = await supabase
          .from('collaboration_requests')
          .delete()
          .eq('id', id);

        if (deleteError) {
          console.error('Error deleting collaboration request:', deleteError);
          return res.status(500).json({
            success: false,
            message: 'Failed to delete collaboration request after rejection',
            error: deleteError.message
          });
        }

        console.log(`Collaboration request ${id} rejected and removed from requests`);
        
        // Return success with the rejection data
        return res.json({
          success: true,
          message: 'Collaboration request rejected successfully',
          data: {
            id: id,
            status: 'rejected',
            action: 'deleted_from_requests_and_added_to_rejected_list'
          }
        });

      } catch (operationError) {
        console.error('Error in post-rejection operations:', operationError);
        return res.status(500).json({
          success: false,
          message: 'Failed to complete rejection process',
          error: operationError.message
        });
      }
    }

    // Broadcast real-time update
    if (global.broadcastToChannel) {
      global.broadcastToChannel('collaboration', {
        type: 'collaboration_request',
        payload: {
          action: 'status_updated',
          request: data
        }
      });
    }

    res.json({
      success: true,
      message: 'Collaboration request status updated successfully',
      data
    });

  } catch (error) {
    console.error('Error in updateCollaborationRequestStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Delete a collaboration request
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const deleteCollaborationRequest = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { id } = req.params;

    const { error } = await supabase
      .from('collaboration_requests')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting collaboration request:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to delete collaboration request',
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Collaboration request deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteCollaborationRequest:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get collaboration request statistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCollaborationStats = async (req, res) => {
  try {
    const supabase = initializeSupabase();
    const { userType, userId } = req.query;

    if (!userType || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: userType, userId'
      });
    }

    // Get counts by status for sent requests
    const { data: sentRequests, error: sentError } = await supabase
      .from('collaboration_requests')
      .select('status')
      .eq('sender_type', userType)
      .eq('sender_id', userId);

    if (sentError) {
      console.error('Error fetching sent requests stats:', sentError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collaboration statistics',
        error: sentError.message
      });
    }

    // Get counts by status for received requests
    const { data: receivedRequests, error: receivedError } = await supabase
      .from('collaboration_requests')
      .select('status')
      .eq('receiver_type', userType)
      .eq('receiver_id', userId);

    if (receivedError) {
      console.error('Error fetching received requests stats:', receivedError);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch collaboration statistics',
        error: receivedError.message
      });
    }

    // Calculate statistics
    const stats = {
      sent: {
        total: sentRequests.length,
        pending: sentRequests.filter(req => req.status === 'pending').length,
        accepted: sentRequests.filter(req => req.status === 'accepted').length,
        rejected: sentRequests.filter(req => req.status === 'rejected').length,
        completed: sentRequests.filter(req => req.status === 'completed').length
      },
      received: {
        total: receivedRequests.length,
        pending: receivedRequests.filter(req => req.status === 'pending').length,
        accepted: receivedRequests.filter(req => req.status === 'accepted').length,
        rejected: receivedRequests.filter(req => req.status === 'rejected').length,
        completed: receivedRequests.filter(req => req.status === 'completed').length
      }
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error in getCollaborationStats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  createCollaborationRequest,
  getUserRequests,
  getCollaborationRequestById,
  updateCollaborationRequestStatus,
  deleteCollaborationRequest,
  getCollaborationStats
}; 