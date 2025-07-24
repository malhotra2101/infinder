# Influencer Search Page Implementation

## Overview

This implementation provides a comprehensive search page for influencers to discover brands and campaigns. The page displays brand cards with expandable campaign details and allows influencers to apply to campaigns with a single click.

## Features

### 🎯 Brand Campaign Cards
- **Expandable Design**: Click any brand card to expand and view detailed campaign information
- **Brand Information**: Display brand name, industry, logo, and campaign count
- **Campaign Details**: Show campaign name, status, platform, description, and dates
- **Visual Indicators**: Status badges, platform icons, and hover effects

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Grid Layout**: Adaptive grid that adjusts to screen width
- **Touch-Friendly**: Large touch targets for mobile devices

### ⚡ Interactive Features
- **Campaign Selection**: Click on campaigns within expanded cards to select them
- **Apply Functionality**: One-click application submission
- **Success Feedback**: Toast notifications for successful applications
- **Loading States**: Smooth loading animations and transitions

## Components

### BrandCampaignCard
**Location**: `client/src/features/search/components/brand-campaign-card/`

**Features**:
- Expandable card design
- Brand logo and information display
- Campaign list with selection functionality
- Apply button with campaign-specific text
- Smooth animations and transitions

**Props**:
```javascript
{
  brand: {
    id: number,
    name: string,
    industry: string,
    logo_url: string,
    description: string
  },
  campaigns: Array<{
    id: number,
    campaign_name: string,
    status: string,
    platform: string,
    vertical: string,
    offer_description: string,
    start_date: string,
    end_date: string,
    budget: number,
    leadflow: string
  }>,
  onApply: (campaign) => void
}
```

### InfluencerSearchPage
**Location**: `client/src/features/search/InfluencerSearchPage.jsx`

**Features**:
- Full search page with filtering and pagination
- Integration with backend API
- Search functionality
- Filter sidebar
- Infinite scroll loading

### InfluencerSearchDemo
**Location**: `client/src/features/search/InfluencerSearchDemo.jsx`

**Features**:
- Demo page with sample data
- Interactive showcase of functionality
- Success message demonstrations
- Feature highlights

## API Endpoints

### GET /api/brands/with-campaigns
**Purpose**: Fetch brands with their active campaigns for influencers

**Query Parameters**:
- `page` (number): Page number for pagination
- `limit` (number): Number of brands per page
- `search` (string): Search term for brand names
- `platform` (string): Filter by platform (instagram, youtube, tiktok, etc.)
- `industry` (string): Filter by industry
- `status` (string): Filter by campaign status (default: 'active')
- `minBudget` (number): Minimum budget filter
- `maxBudget` (number): Maximum budget filter

**Response**:
```json
{
  "success": true,
  "message": "Brands with campaigns fetched successfully",
  "data": {
    "brands": [
      {
        "brand": {
          "id": 1,
          "name": "Nike",
          "industry": "Sports & Fitness",
          "logo_url": "https://...",
          "description": "..."
        },
        "campaigns": [
          {
            "id": 1,
            "campaign_name": "Summer Fitness Challenge",
            "status": "active",
            "platform": "instagram",
            "vertical": "fitness",
            "offer_description": "...",
            "start_date": "2025-06-01",
            "end_date": "2025-08-31",
            "budget": 5000,
            "leadflow": "CPL"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "hasMore": true
    }
  }
}
```

### POST /api/applications
**Purpose**: Submit influencer application to a campaign

**Request Body**:
```json
{
  "campaignId": 1,
  "influencerId": 1,
  "message": "I'm interested in applying for this campaign",
  "status": "pending"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Application created successfully",
  "data": {
    "id": 1,
    "influencer_id": 1,
    "campaign_id": 1,
    "status": "pending",
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

## Usage Examples

### Basic Implementation
```jsx
import InfluencerSearchPage from './features/search/InfluencerSearchPage';

function App() {
  return (
    <div className="app">
      <InfluencerSearchPage sidebarOpen={false} />
    </div>
  );
}
```

### Demo Page
```jsx
import InfluencerSearchDemo from './features/search/InfluencerSearchDemo';

function App() {
  return (
    <div className="app">
      <InfluencerSearchDemo />
    </div>
  );
}
```

### Custom Brand Campaign Card
```jsx
import BrandCampaignCard from './features/search/components/brand-campaign-card/BrandCampaignCard';

const brandData = {
  brand: {
    id: 1,
    name: "Nike",
    industry: "Sports & Fitness",
    logo_url: "https://...",
    description: "Just Do It"
  },
  campaigns: [
    {
      id: 1,
      campaign_name: "Summer Challenge",
      status: "active",
      platform: "instagram",
      // ... other campaign data
    }
  ]
};

function MyComponent() {
  const handleApply = (campaign) => {
    console.log('Applying to campaign:', campaign.campaign_name);
    // Handle application logic
  };

  return (
    <BrandCampaignCard
      brand={brandData.brand}
      campaigns={brandData.campaigns}
      onApply={handleApply}
    />
  );
}
```

## Styling

### CSS Variables
The components use CSS custom properties for consistent theming:

```css
:root {
  --primary-color: #3b82f6;
  --primary-dark: #1d4ed8;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --bg-primary: #ffffff;
  --bg-secondary: #f8fafc;
  --border-light: rgba(0, 0, 0, 0.06);
  --border-medium: rgba(0, 0, 0, 0.1);
  --radius-md: 12px;
  --radius-lg: 16px;
  --transition-fast: 0.2s ease;
  --transition-medium: 0.3s ease;
}
```

### Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px to 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Considerations

- **Lazy Loading**: Images are loaded with error fallbacks
- **Debounced Search**: Search input is debounced to prevent excessive API calls
- **Infinite Scroll**: Efficient pagination with infinite scroll
- **Optimized Animations**: CSS transforms and opacity for smooth animations
- **Minimal Re-renders**: React.memo and useCallback for performance optimization

## Accessibility

- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant color contrast ratios
- **Alt Text**: Descriptive alt text for all images

## Future Enhancements

- **Advanced Filtering**: More sophisticated filter options
- **Saved Searches**: Allow influencers to save search preferences
- **Application Tracking**: Track application status and history
- **Notifications**: Real-time notifications for new campaigns
- **Analytics**: Track engagement and application success rates
- **Multi-language Support**: Internationalization support
- **Dark Mode**: Dark theme option
- **Offline Support**: Service worker for offline functionality

## Troubleshooting

### Common Issues

1. **Cards not expanding**: Check if click handlers are properly bound
2. **API errors**: Verify backend server is running and endpoints are accessible
3. **Styling issues**: Ensure CSS files are properly imported
4. **Performance issues**: Check for unnecessary re-renders and optimize accordingly

### Debug Mode
Enable debug logging by setting `localStorage.debug = 'influencer-search:*'` in browser console.

## Contributing

1. Follow the existing code style and patterns
2. Add proper TypeScript types if using TypeScript
3. Include unit tests for new components
4. Update documentation for any API changes
5. Test on multiple devices and browsers

## License

This implementation is part of the Infinder project and follows the same licensing terms. 