# 📊 Infinder Data Map

A comprehensive overview of the data architecture, flow, and system structure for the Infinder influencer marketing platform.

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express.js)  │◄──►│   (Supabase)    │
│   Port: 3001    │    │   Port: 5050    │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components    │    │   Controllers   │    │   Tables        │
│   - Dashboard   │    │   - Influencer  │    │   - influencers │
│   - Search      │    │   - Campaign    │    │   - campaigns   │
│   - Campaigns   │    │   - Health      │    │   - countries   │
│   - Profile     │    │                 │    │   - lists       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Database Schema

### Core Tables

#### 1. **influencers** Table
```sql
CREATE TABLE influencers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  category VARCHAR(100),
  platform VARCHAR(50),
  followers INTEGER,
  engagement_rate DECIMAL(5,2),
  country VARCHAR(100),
  age_group VARCHAR(20),
  last_active TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 2. **campaigns** Table
```sql
CREATE TABLE campaigns (
  id BIGSERIAL PRIMARY KEY,
  brand_name VARCHAR(255) NOT NULL,
  campaign_id VARCHAR(100),
  campaign_name VARCHAR(255) NOT NULL,
  leadflow VARCHAR(50) NOT NULL,
  tracking_url TEXT NOT NULL,
  preview_url TEXT,
  creative_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  offer_description TEXT,
  kpi TEXT,
  restrictions TEXT,
  vertical VARCHAR(100),
  countries VARCHAR(100),
  platform VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL,
  start_date DATE,
  end_date DATE,
  is_private BOOLEAN DEFAULT false,
  requires_approval BOOLEAN DEFAULT false
);
```

#### 3. **countries** Table
```sql
CREATE TABLE countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 4. **influencer_lists** Table
```sql
CREATE TABLE influencer_lists (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id),
  list_type VARCHAR(20) NOT NULL CHECK (list_type IN ('selected', 'rejected', 'suggested')),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(influencer_id, list_type)
);
```

#### 5. **dashboard_metrics** Table
```sql
CREATE TABLE dashboard_metrics (
  id SERIAL PRIMARY KEY,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_campaigns INTEGER DEFAULT 0,
  active_influencers INTEGER DEFAULT 0,
  avg_engagement DECIMAL(5,2) DEFAULT 0,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. **influencer_performance** Table
```sql
CREATE TABLE influencer_performance (
  id SERIAL PRIMARY KEY,
  influencer_id INTEGER REFERENCES influencers(id),
  campaign_id INTEGER REFERENCES campaigns(id),
  revenue DECIMAL(10,2) DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  followers INTEGER DEFAULT 0,
  month VARCHAR(10),
  year INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Dashboard  │  │    Search    │  │  Campaigns  │          │
│  │   Components │  │   Components │  │  Components │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│         │                 │                 │                 │
│         ▼                 ▼                 ▼                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              API Services Layer                        │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │ dashboardApi │  │ backendApi  │  │ campaignApi │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        BACKEND                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Express.js Server                         │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │   │
│  │  │   Routes    │  │ Controllers │  │  Services   │   │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │ influencers │  │  campaigns   │  │  countries  │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │    lists    │  │   metrics   │  │ performance │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

## 🌐 API Endpoints

### Influencer Endpoints
```
GET    /api/influencers              # Get all influencers with filtering
GET    /api/influencers/:id          # Get specific influencer
GET    /api/influencers/countries/list  # Get available countries
POST   /api/influencers/lists/add    # Add influencer to list
DELETE /api/influencers/lists/remove # Remove influencer from list
GET    /api/influencers/lists/:type  # Get influencers by list type
GET    /api/influencers/lists/counts # Get list counts
POST   /api/influencers/lists/reset  # Reset all lists
```

### Campaign Endpoints
```
GET    /api/campaigns                # Get all campaigns
GET    /api/campaigns/:id            # Get specific campaign
POST   /api/campaigns                # Create new campaign
PUT    /api/campaigns/:id            # Update campaign
DELETE /api/campaigns/:id            # Delete campaign
GET    /api/campaigns/stats          # Get campaign statistics
```

### Health & System Endpoints
```
GET    /api/ping                     # Health check
GET    /api/info                     # System information
```

## 📱 Frontend Data Flow

### 1. **Dashboard Flow**
```
Dashboard Component
    ↓
dashboardApi.js
    ↓
GET /api/dashboard/metrics
    ↓
Supabase Query
    ↓
Display Metrics Cards
```

### 2. **Search Flow**
```
SearchPage Component
    ↓
Header Component (Tabs)
    ↓
backendApi.js
    ↓
GET /api/influencers
    ↓
Filter & Display Results
```

### 3. **Campaigns Flow**
```
CampaignsPage Component
    ↓
campaignApi.js
    ↓
GET /api/campaigns
    ↓
Display Campaign Table
```

## 🔧 Backend Data Flow

### 1. **Request Processing**
```
HTTP Request
    ↓
Express Router
    ↓
Controller Function
    ↓
Supabase Query
    ↓
Response JSON
```

### 2. **Error Handling**
```
Request
    ↓
Try/Catch Block
    ↓
Error Handler
    ↓
Standardized Error Response
```

## 📊 Data Relationships

### Entity Relationship Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ influencers │    │  campaigns   │    │  countries  │
│             │    │             │    │             │
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ name        │    │ brand_name  │    │ name        │
│ platform    │    │ campaign_id │    │ code        │
│ followers   │    │ status      │    └─────────────┘
│ country     │    │ platform    │
└─────────────┘    └─────────────┘
       │                   │
       │                   │
       ▼                   ▼
┌─────────────┐    ┌─────────────┐
│    lists    │    │ performance │
│             │    │             │
│ influencer_id│   │ influencer_id│
│ list_type   │   │ campaign_id │
│             │   │ revenue     │
└─────────────┘   └─────────────┘
```

## 🔄 State Management

### Frontend State
```javascript
// Component State
const [influencers, setInfluencers] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Context State (Auth)
const { user, login, logout } = useAuth();
```

### Backend State
```javascript
// Database State (Supabase)
const supabase = initializeSupabase();

// Session State
const session = await supabase.auth.getSession();
```

## 📈 Performance Considerations

### 1. **Database Indexes**
```sql
-- Influencers table indexes
CREATE INDEX idx_influencers_platform ON influencers(platform);
CREATE INDEX idx_influencers_country ON influencers(country);
CREATE INDEX idx_influencers_followers ON influencers(followers);

-- Campaigns table indexes
CREATE INDEX idx_campaigns_status ON campaigns(status);
CREATE INDEX idx_campaigns_platform ON campaigns(platform);
CREATE INDEX idx_campaigns_brand_name ON campaigns(brand_name);
```

### 2. **Caching Strategy**
- Frontend: React Query for API caching
- Backend: Supabase connection pooling
- Database: PostgreSQL query optimization

### 3. **Pagination**
```javascript
// API pagination
const { page = 1, limit = 20 } = req.query;
const offset = (page - 1) * limit;
```

## 🔒 Security Considerations

### 1. **Authentication**
- Supabase Auth integration
- JWT token management
- Session handling

### 2. **Data Validation**
```javascript
// Input validation
const { error } = schema.validate(req.body);
if (error) {
  return res.status(400).json({ error: error.details[0].message });
}
```

### 3. **CORS Configuration**
```javascript
app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3003'],
  credentials: true
}));
```

## 🚀 Deployment Architecture

### Development Environment
```
Frontend: http://localhost:3001
Backend:  http://localhost:5050
Database: Supabase (Cloud)
```

### Production Environment
```
Frontend: Vercel/Netlify
Backend:  Railway/Render
Database: Supabase (Cloud)
```

## 📋 Data Migration & Setup

### 1. **Database Setup**
```bash
# Database setup is handled through Supabase dashboard
# Run SQL scripts directly in Supabase SQL Editor
```

### 2. **Sample Data Insertion**
```bash
# Sample data can be inserted through Supabase dashboard
# or using the provided SQL scripts in the config directory
```

### 3. **Environment Configuration**
```env
# Frontend (.env.local)
VITE_API_URL=http://localhost:5050/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Backend (.env)
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_key
```

## 🔍 Monitoring & Analytics

### 1. **API Monitoring**
- Request/response logging
- Error tracking
- Performance metrics

### 2. **Database Monitoring**
- Query performance
- Connection pooling
- Storage usage

### 3. **Frontend Monitoring**
- Component rendering
- User interactions
- Error boundaries

## 📚 Key Files & Directories

### Frontend Structure
```
client/src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
│   ├── auth/          # Authentication pages
│   ├── for-brand/     # Brand dashboard pages
│   └── landing-page/  # Landing page
├── services/           # API services
├── contexts/           # React contexts
├── hooks/              # Custom hooks
└── utils/              # Utility functions
```

### Backend Structure
```
server/src/
├── controllers/        # Request handlers
├── routes/            # API route definitions
├── config/            # Database configuration
├── services/          # Business logic
└── utils/             # Utility functions
```

This data map provides a comprehensive overview of your influencer marketing platform's architecture, data flow, and system structure. It serves as a reference for understanding how data moves through your application and how different components interact with each other. 