# 🚀 Infinder API Postman Setup Guide

## 📥 Import Collection

1. **Download** the `Infinder_API_Collection.postman_collection.json` file
2. **Open Postman**
3. **Click Import** → **Upload Files** → Select the JSON file
4. **Import** the collection

## 🔧 Environment Setup

### Create Environment Variables:
1. **Click** the gear icon (⚙️) in top-right
2. **Add** new environment named "Infinder Local"
3. **Add these variables**:

| Variable | Initial Value | Current Value |
|----------|---------------|---------------|
| `base_url` | `http://localhost:5051` | `http://localhost:5051` |
| `jwt_token` | (leave empty) | (auto-filled) |
| `brand_id` | `20` | `20` |
| `campaign_id` | `23` | `23` |
| `influencer_id` | `1022` | `1022` |

4. **Save** and **Select** this environment

## 🧪 Testing Workflow

### Step 1: Authentication
1. **Run** "User Login" request
2. **JWT token** will be automatically saved
3. **Verify** with "Get User Profile"

### Step 2: Test Core APIs
1. **Health Check** - Verify server is running
2. **Get All Influencers** - Test influencer data
3. **Get All Campaigns** - Test campaign data

### Step 3: Test Protected APIs
1. **Create Campaign** - Test POST with auth
2. **Create Collaboration Request** - Test complex POST
3. **Get Email Sequences** - Test email marketing

## 📊 API Categories

### ✅ **Working APIs (Test These)**

#### 🔐 Authentication
- `GET /api/ping` - Health check
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile

#### 👥 Influencers
- `GET /api/influencers` - Get all influencers (114 available)
- `GET /api/influencers/:id` - Get specific influencer
- `GET /api/influencers/lists/counts` - Get influencer counts

#### 📈 Campaigns
- `GET /api/campaigns` - Get all campaigns (6 available)
- `POST /api/campaigns` - Create campaign (requires auth)
- `GET /api/campaigns/:id` - Get specific campaign
- `GET /api/campaigns/stats` - Get campaign statistics
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign

#### 🤝 Collaboration Requests
- `GET /api/collaboration-requests` - Get all requests
- `POST /api/collaboration-requests` - Create request (requires auth)
- `GET /api/collaboration-requests/:id` - Get specific request
- `GET /api/collaboration-requests/stats` - Get statistics
- `PUT /api/collaboration-requests/:id/status` - Update status
- `DELETE /api/collaboration-requests/:id` - Delete request

#### 📧 Email Marketing
- `GET /api/email-templates` - Get email templates (4 available)
- `POST /api/email-templates` - Create template (requires auth)
- `GET /api/email-sequences/brand/:brand_id` - Get sequences
- `POST /api/email-sequences` - Create sequence (requires auth)
- `GET /api/email-sequences/:id` - Get specific sequence
- `POST /api/email-sequences/:id/start` - Start sequence
- `GET /api/email-tracking/analytics/:sequence_id` - Get analytics
- `GET /api/email-tracking/:tracking_id/open` - Track email open
- `GET /api/email-tracking/:tracking_id/click` - Track email click
- `POST /api/email-tracking/response` - Record response
- `GET /api/email-tracking/unsubscribe` - Handle unsubscribe

#### 🌐 System
- `GET /api/info` - API information
- `GET /api/events` - Server-Sent Events

## 🔑 Test Credentials

```json
{
  "email": "testuser@example.com",
  "password": "test123",
  "brandName": "Test Brand"
}
```

## ⚠️ Important Notes

1. **Authentication Required**: Most POST/PUT/DELETE requests need JWT token
2. **Auto Token Extraction**: Login response automatically saves JWT token
3. **Field Names**: Use camelCase (e.g., `campaignName`, not `campaign_name`)
4. **Required Fields**: Check request body examples for required fields
5. **Server Running**: Ensure backend is running on `http://localhost:5051`

## 🚨 Common Issues

### 401 Unauthorized
- **Solution**: Run "User Login" first to get JWT token

### 400 Bad Request
- **Solution**: Check field names and required fields

### 404 Not Found
- **Solution**: Use correct route format (e.g., `/brand/:brand_id`)

### Connection Refused
- **Solution**: Start backend server with `npm start` in server directory

## 🎯 Quick Test Sequence

1. **Health Check** → Should return 200
2. **User Login** → Should return JWT token
3. **Get User Profile** → Should return user data
4. **Get All Influencers** → Should return 114 influencers
5. **Create Campaign** → Should create new campaign
6. **Get All Campaigns** → Should show new campaign

## 📈 Success Indicators

- ✅ **200 OK** - Request successful
- ✅ **JWT token** - Authentication working
- ✅ **Data returned** - APIs returning expected data
- ✅ **No errors** - All requests completing successfully

---

**Happy Testing! 🚀**
