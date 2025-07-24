# Infinder Client Source Structure

This document outlines the organized structure of the Infinder client application, following industry-level practices for maintainability and scalability.

## 📁 Directory Structure

```
src/
├── brand/                    # Brand-specific functionality
│   ├── components/          # Brand-specific components
│   │   ├── analytics/       # Dashboard analytics components
│   │   ├── brand-campaign-card/  # Campaign card components
│   │   ├── campaign-selection-modal/  # Campaign selection modals
│   │   ├── filter-sidebar/  # Search filter components
│   │   ├── header/          # Header components
│   │   ├── metrics/         # Dashboard metrics components
│   │   ├── performance/     # Performance tracking components
│   │   ├── revenue/         # Revenue tracking components
│   │   ├── search-bar/      # Search functionality
│   │   ├── table/           # Data table components
│   │   └── top-influencers/ # Top influencers components
│   ├── pages/               # Brand-specific pages
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── CampaignsPage.jsx # Campaigns management
│   │   ├── SearchPage.jsx   # Influencer search
│   │   ├── ContactPage.jsx  # Contact page
│   │   └── ProfilePage.jsx  # Profile management
│   ├── services/            # Brand-specific services
│   ├── styles/              # Brand-specific styles
│   ├── utils/               # Brand-specific utilities
│   └── index.js             # Brand module exports
│
├── influencer/               # Influencer-specific functionality
│   ├── components/          # Influencer-specific components
│   │   ├── influencer-card/ # Influencer card components
│   │   └── requests/        # Request management components
│   ├── pages/               # Influencer-specific pages
│   │   ├── InfluencerPage.jsx # Main influencer page
│   │   ├── InfluencerDashboardPage.jsx # Influencer dashboard
│   │   ├── InfluencerSearchPage.jsx # Campaign search
│   │   ├── InfluencerSelectedCampaignsPage.jsx # Selected campaigns
│   │   ├── InfluencerProfilePage.jsx # Profile management
│   │   └── InfluencerSearchDemo.jsx # Search demo
│   ├── services/            # Influencer-specific services
│   ├── styles/              # Influencer-specific styles
│   ├── utils/               # Influencer-specific utilities
│   └── index.js             # Influencer module exports
│
├── shared/                   # Shared functionality
│   ├── components/          # Shared components
│   │   └── shared/          # Reusable components
│   │       ├── ui/          # UI components
│   │       ├── navbar/      # Navigation components
│   │       ├── sidebar/     # Sidebar components
│   │       ├── footer/      # Footer components
│   │       ├── collaboration/ # Collaboration components
│   │       ├── contact/     # Contact components
│   │       ├── hero/        # Hero section components
│   │       ├── notification/ # Notification components
│   │       ├── icons/       # Icon components
│   │       └── index.js     # Shared components exports
│   ├── config/              # Configuration files
│   ├── constants/           # Application constants
│   ├── hooks/               # Custom React hooks
│   ├── layouts/             # Layout components
│   ├── services/            # Shared services
│   ├── utils/               # Shared utilities
│   └── index.js             # Shared module exports
│
├── features/                 # Feature-specific modules (legacy)
│   ├── auth/                # Authentication
│   └── landing/             # Landing page
│
└── index.js                 # Main application exports
```

## 🏗️ Architecture Principles

### 1. **Separation of Concerns**
- **Brand Module**: All brand-specific functionality
- **Influencer Module**: All influencer-specific functionality
- **Shared Module**: Reusable components and utilities

### 2. **Modular Design**
- Each module has its own components, pages, services, and utilities
- Clear boundaries between different user types
- Easy to maintain and scale

### 3. **Industry Standards**
- **Barrel Exports**: Index files for clean imports
- **Component Organization**: Logical grouping of related components
- **File Naming**: Consistent naming conventions
- **Directory Structure**: Scalable and maintainable

## 📦 Module Exports

### Brand Module
```javascript
import { Dashboard, CampaignsPage, SearchPage } from './brand';
```

### Influencer Module
```javascript
import { InfluencerPage, InfluencerDashboardPage } from './influencer';
```

### Shared Module
```javascript
import { Navbar, Sidebar, Button } from './shared';
```

## 🔄 Migration Notes

### Moved Files
- **Dashboard**: `features/dashboard/` → `brand/pages/`
- **Campaigns**: `features/campaigns/` → `brand/pages/`
- **Search**: `features/search/` → `brand/pages/` (brand search)
- **Influencer Pages**: `features/influencer/` → `influencer/pages/`
- **Influencer Search**: `features/search/InfluencerSearchPage.jsx` → `influencer/pages/`
- **Components**: Organized by user type and functionality

### Import Updates Required
- Update all import statements to use new paths
- Use barrel exports for cleaner imports
- Update layout files to import from new locations

## 🚀 Benefits

1. **Clear Separation**: Brand and influencer functionality are clearly separated
2. **Maintainability**: Easier to find and modify specific functionality
3. **Scalability**: Easy to add new features to specific modules
4. **Team Collaboration**: Different teams can work on different modules
5. **Code Reusability**: Shared components are clearly identified
6. **Testing**: Easier to test specific modules in isolation

## 📝 Next Steps

1. Update all import statements throughout the application
2. Update layout files to use new import paths
3. Test all functionality to ensure nothing is broken
4. Update documentation for team members
5. Consider moving auth and landing to their own modules if they grow 