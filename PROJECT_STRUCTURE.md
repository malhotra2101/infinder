# Infinder Project Structure

This document outlines the new, scalable, industry-standard folder structure for the Infinder MERN stack project.

## Overview

The project has been reorganized into a clean, modular structure that separates concerns and promotes maintainability. The structure follows industry best practices for both frontend and backend development.

## Backend Structure (`/server`)

```
server/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── environment.js      # Environment variables and app config
│   │   └── supabase.js         # Supabase client configuration
│   ├── controllers/            # Request handlers (business logic)
│   │   ├── influencerController.js
│   │   ├── campaignController.js
│   │   ├── brandController.js
│   │   ├── applicationController.js
│   │   └── collaborationController.js
│   ├── middleware/             # Express middleware
│   │   ├── logger.js           # Request logging
│   │   └── security.js         # CORS, rate limiting, helmet
│   ├── models/                 # Data models (if needed)
│   ├── routes/                 # API route definitions
│   │   ├── influencerRoutes.js
│   │   ├── campaignRoutes.js
│   │   ├── brandRoutes.js
│   │   ├── applicationRoutes.js
│   │   └── collaborationRoutes.js
│   ├── services/               # Business logic and data access
│   │   ├── baseService.js      # Base service class for Supabase operations
│   │   ├── influencerService.js
│   │   ├── campaignService.js
│   │   ├── brandService.js
│   │   └── collaborationService.js
│   ├── utils/                  # Utility functions
│   │   └── errorHandler.js     # Centralized error handling
│   └── app.js                  # Express app configuration
├── index.js                    # Server entry point
├── package.json
├── env.example                 # Environment variables template
└── .env                        # Environment variables (not in git)
```

### Key Backend Features

- **Environment Configuration**: Centralized environment variable management
- **Service Layer**: All Supabase operations isolated in services
- **Error Handling**: Centralized error handling with custom error classes
- **Security Middleware**: CORS, rate limiting, helmet, and request size limits
- **Logging**: Request logging with Morgan and custom middleware
- **Base Service**: Reusable service class for common database operations

## Frontend Structure (`/client`)

```
client/
├── src/
│   ├── features/               # Feature-based organization
│   │   ├── auth/               # Authentication feature
│   │   │   ├── components/     # Auth-specific components
│   │   │   ├── hooks/          # Auth-specific hooks
│   │   │   ├── services/       # Auth-specific services
│   │   │   └── pages/          # Auth pages
│   │   ├── dashboard/          # Dashboard feature
│   │   ├── search/             # Search feature
│   │   ├── campaigns/          # Campaigns feature
│   │   ├── profile/            # Profile feature
│   │   └── landing/            # Landing page feature
│   ├── shared/                 # Shared components and utilities
│   │   ├── components/         # Global components
│   │   ├── layouts/            # Layout components
│   │   └── ui/                 # Reusable UI components
│   │       ├── Button.jsx
│   │       ├── Button.css
│   │       └── index.js
│   ├── services/               # API services
│   │   └── api.js              # Centralized API service layer
│   ├── hooks/                  # Custom React hooks
│   │   └── useApi.js           # React Query hooks
│   ├── constants/              # Application constants
│   │   └── index.js            # Centralized constants
│   ├── utils/                  # Utility functions
│   ├── types/                  # Type definitions (if using TypeScript)
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # App entry point
├── package.json
└── vite.config.js
```

### Key Frontend Features

- **Feature-Based Organization**: Components grouped by feature, not by type
- **React Query Integration**: Centralized data fetching and caching
- **Shared UI Library**: Reusable UI components with consistent styling
- **API Service Layer**: Centralized API calls with error handling
- **Constants Management**: Centralized application constants
- **Custom Hooks**: Reusable logic for API operations

## Key Improvements

### Backend Improvements

1. **Modular Architecture**: Clear separation of concerns with controllers, services, and routes
2. **Environment Management**: Centralized configuration with validation
3. **Error Handling**: Consistent error responses with proper logging
4. **Security**: Comprehensive security middleware
5. **Service Layer**: All database operations isolated in services
6. **Base Service**: Reusable service class for common operations

### Frontend Improvements

1. **Feature-Based Structure**: Components organized by feature for better maintainability
2. **React Query**: Efficient data fetching with caching and background updates
3. **Shared UI Components**: Consistent, reusable UI components
4. **API Service Layer**: Centralized API calls with proper error handling
5. **Constants Management**: Centralized application constants
6. **Custom Hooks**: Reusable logic for common operations

## Environment Setup

### Backend Environment Variables

Create a `.env` file in the server directory with the following variables:

```env
# Server Configuration
PORT=5052
NODE_ENV=development

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Security
JWT_SECRET=your_jwt_secret_key
SESSION_SECRET=your_session_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Origins (comma-separated)
CORS_ORIGINS=http://localhost:3001,http://localhost:3003,http://localhost:3004,http://localhost:3011,http://localhost:5174,http://localhost:3000,http://localhost:5173

# Logging
LOG_LEVEL=info
```

### Frontend Environment Variables

Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5052/api
VITE_APP_NAME=Infinder
VITE_APP_VERSION=1.0.0
```

## Development Workflow

### Starting the Development Servers

```bash
# Start both frontend and backend
pnpm dev

# Start only frontend
pnpm dev:client

# Start only backend
pnpm dev:server
```

### Adding New Features

1. **Backend**: Create new service, controller, and route files
2. **Frontend**: Create new feature folder with components, hooks, and services
3. **API**: Add new endpoints to the API service layer
4. **Hooks**: Create React Query hooks for data fetching

## TODO Items

### Backend TODOs

- [ ] Complete refactoring of remaining controller methods
- [ ] Add validation middleware
- [ ] Add authentication middleware
- [ ] Add database migrations
- [ ] Add comprehensive logging
- [ ] Add unit tests
- [ ] Add integration tests

### Frontend TODOs

- [ ] Add React Query provider to main app
- [ ] Create more shared UI components
- [ ] Add form validation library
- [ ] Add state management (if needed)
- [ ] Add unit tests
- [ ] Add integration tests
- [ ] Add error boundaries
- [ ] Add loading states

## Best Practices

### Backend

- Always use the service layer for database operations
- Use the base service class for common CRUD operations
- Handle errors consistently using the error handler
- Validate environment variables on startup
- Use proper HTTP status codes
- Log important operations

### Frontend

- Use React Query for all API calls
- Organize components by feature
- Use shared UI components for consistency
- Handle loading and error states
- Use proper TypeScript (if implemented)
- Follow React best practices

## Migration Notes

- Existing functionality has been preserved
- Import paths may need to be updated
- Some controller methods are marked with TODO for future refactoring
- The structure is designed to be scalable and maintainable 