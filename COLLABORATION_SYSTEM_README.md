# Enhanced Collaboration System

## 🎯 Overview

This system implements a complete collaboration workflow between influencers and brands with campaign-specific assignments. The system allows influencers to send collaboration requests for specific campaigns, and when brands accept these requests, the data automatically flows from the collaboration requests table to the influencer lists table with proper campaign tracking.

## 🚀 Key Features

### ✅ Complete Workflow
- **Influencers can send requests** for specific campaigns
- **Brands can accept/reject** requests with one click
- **Automatic data flow** from requests to assignments
- **Campaign-specific tracking** for all assignments

### ✅ Enhanced UI Components
- **View Details Modal**: Shows actual campaign assignments
- **Remove Modal**: Allows campaign-specific removals
- **Influencer Cards**: Display collaboration status
- **Search Page**: Handles the complete workflow

### ✅ Database Integration
- **Campaign ID tracking** in influencer_lists table
- **Seamless data migration** from requests to assignments
- **Proper constraints** to maintain data integrity

## 📋 System Requirements

- Node.js 16+
- Supabase account
- PostgreSQL database (via Supabase)

## 🛠️ Setup Instructions

### Step 1: Database Migration

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `server/run-migration.sql`
4. Click "Run" to execute the migration

### Step 2: Test the Migration

```bash
cd server
node test-campaign-id-migration.js
```

### Step 3: Start the Server

```bash
cd server
npm run dev
```

### Step 4: Start the Client

```bash
cd client
npm run dev
```

## 🔄 Workflow

### 1. Influencer Sends Request

```javascript
// Influencer sends collaboration request
const response = await fetch('/api/influencers/send-request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    influencerId: 1,
    brandId: 1,
    campaignId: 3,
    message: "I'd like to collaborate on your summer campaign"
  })
});
```

### 2. Brand Accepts Request

```javascript
// Brand accepts the request
const response = await fetch('/api/collaboration-requests/1/status', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ status: 'accepted' })
});

// This automatically:
// 1. Adds influencer to influencer_lists with campaign_id
// 2. Removes request from collaboration_requests
// 3. Updates UI to show influencer in selected tab
```

### 3. View Campaign Details

When you click "View Details" on an influencer card in the selected tab, it will show:
- Campaign name and brand
- Campaign platform and status
- Assignment date
- Campaign start/end dates

### 4. Remove from Campaigns

When you click "Remove" on an influencer card:
- Modal shows all campaigns the influencer is assigned to
- You can select specific campaigns to remove from
- Only removes from selected campaigns, not all assignments

## 📊 API Endpoints

### Collaboration Requests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/collaboration-requests` | Create collaboration request |
| GET | `/api/collaboration-requests` | Get user requests |
| PUT | `/api/collaboration-requests/:id/status` | Update request status |
| DELETE | `/api/collaboration-requests/:id` | Delete request |

### Influencer Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/influencers/send-request` | Send collaboration request |
| GET | `/api/influencers/:id/campaigns` | Get influencer campaigns |
| POST | `/api/influencers/lists/remove-campaigns` | Remove from multiple campaigns |

## 🎨 Frontend Components

### ViewDetailsModal
- **Location**: `client/src/pages/for-brand/pages/search/components/influencer-card/ViewDetailsModal.jsx`
- **Purpose**: Shows campaign assignments for an influencer
- **Features**: Campaign details, assignment dates, status information

### RemoveModal
- **Location**: `client/src/pages/for-brand/pages/search/components/influencer-card/RemoveModal.jsx`
- **Purpose**: Allows campaign-specific removals
- **Features**: Campaign selection, bulk removal, confirmation

### InfluencerCard
- **Location**: `client/src/pages/for-brand/pages/search/components/influencer-card/InfluencerCard.jsx`
- **Purpose**: Displays influencer information with action buttons
- **Features**: View details, remove, accept/reject buttons

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the server directory:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=5052
```

### Database Schema

The system uses these key tables:

1. **influencer_lists**: Stores campaign assignments with campaign_id
2. **collaboration_requests**: Stores pending collaboration requests
3. **campaigns**: Stores campaign information
4. **influencers**: Stores influencer information

## 🧪 Testing

### Test the Migration

```bash
cd server
node test-campaign-id-migration.js
```

### Test API Endpoints

```bash
# Test collaboration request creation
curl -X POST http://localhost:5052/api/collaboration-requests \
  -H "Content-Type: application/json" \
  -d '{
    "senderType": "influencer",
    "senderId": 1,
    "receiverType": "brand",
    "receiverId": 1,
    "campaignId": 1,
    "requestType": "campaign_assignment"
  }'

# Test accepting a request
curl -X PUT http://localhost:5052/api/collaboration-requests/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

## 🐛 Troubleshooting

### Common Issues

1. **Campaign ID Column Missing**
   - Run the SQL migration manually in Supabase dashboard
   - Check that the migration completed successfully

2. **API 404 Errors**
   - Verify server is running on port 5052
   - Check that all routes are registered correctly
   - Ensure environment variables are set

3. **Database Constraint Errors**
   - Check that old constraints were dropped
   - Verify new constraints were added correctly
   - Run the test script to verify setup

### Debug Steps

1. Check database schema:
   ```sql
   SELECT * FROM influencer_lists LIMIT 1;
   ```

2. Test API endpoints with curl or Postman

3. Check server logs for errors

4. Verify frontend API calls are correct

## 📈 Benefits

### For Brands
- **Streamlined workflow**: Accept/reject requests with one click
- **Campaign-specific management**: Track assignments per campaign
- **Better organization**: Clear view of all collaborations

### For Influencers
- **Easy application**: Send requests for specific campaigns
- **Clear feedback**: Know when requests are accepted/rejected
- **Campaign context**: Understand which campaigns they're assigned to

### For Developers
- **Scalable architecture**: Supports multiple campaigns per influencer
- **Data integrity**: Proper constraints and relationships
- **Easy maintenance**: Clear separation of concerns

## 🔮 Future Enhancements

- **Influencer Dashboard**: Interface for influencers to manage requests
- **Notification System**: Real-time updates for request status changes
- **Analytics**: Track collaboration success rates
- **Bulk Operations**: Accept/reject multiple requests at once
- **Email Notifications**: Automated email alerts
- **Mobile App**: Native mobile application

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the API documentation
3. Check server logs for error messages
4. Test with sample data to isolate issues
5. Verify database schema and constraints

---

**Version**: 2.0.0  
**Last Updated**: 2024-01-17  
**Status**: Production Ready 