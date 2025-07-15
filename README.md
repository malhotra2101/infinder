# Infinder

A modern Influencer Marketing Platform built with React, Express.js, and Supabase.

## Project Structure

```
infinder/
├── client/          # React frontend (port 3001)
├── server/          # Express backend (port 5051)
├── package.json     # Root workspace configuration
└── pnpm-workspace.yaml
```

## Ports Used

- **Frontend**: `http://localhost:3001`
- **Backend**: `http://localhost:5051`
- **Preview**: `http://localhost:4001`

## Quick Start

1. **Install dependencies:**
   ```bash
   cd infinder
   pnpm install
   ```

2. **Start both client and server:**
   ```bash
   pnpm dev
   ```

3. **Start only client:**
   ```bash
   pnpm dev:client
   ```

4. **Start only server:**
   ```bash
   pnpm dev:server
   ```

## Development

This project features:
- Modern React with Vite
- Express.js backend with API endpoints
- Supabase integration for database
- Hot module replacement for fast development
- ESLint and Prettier configuration

## Features

- **Frontend**: Modern React with Vite for fast development
- **Backend**: Express.js with RESTful API endpoints
- **Database**: Supabase integration for real-time data
- **Authentication**: Secure user authentication system
- **UI/UX**: Responsive design with modern components
- **Development**: Hot module replacement and linting

## Commands

- `pnpm dev` - Start both client and server
- `pnpm dev:client` - Start only the React frontend
- `pnpm dev:server` - Start only the Express backend
- `pnpm build` - Build the frontend for production 