# Infinder New Design

This is the new design iteration for the Infinder Influencer Marketing Platform. This project runs in isolation from the original design to allow for experimentation and comparison.

## Project Structure

```
new-design/
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
   cd new-design
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

This project is completely isolated from the original design:
- Different ports to avoid conflicts
- Separate package.json files
- Independent development environment
- Can run alongside the original design

## Features

- Modern React with Vite
- Express.js backend
- Supabase integration
- Hot module replacement
- ESLint and Prettier configuration

## Commands

- `pnpm dev` - Start both client and server
- `pnpm dev:client` - Start only the React frontend
- `pnpm dev:server` - Start only the Express backend
- `pnpm build` - Build the frontend for production 