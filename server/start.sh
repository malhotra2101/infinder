#!/bin/bash

# Infinder Server Startup Script
# This script ensures the server starts with proper configuration

echo "🚀 Starting Infinder Server..."

# Set default environment if not already set
export NODE_ENV=${NODE_ENV:-development}

# Kill any existing node processes on port 5050
echo "🔄 Checking for existing processes on port 5050..."
lsof -ti:5050 | xargs kill -9 2>/dev/null || true

# Wait a moment for port to be freed
sleep 2

# Check if we're in the right directory
if [ ! -f "index.js" ]; then
    echo "❌ Error: index.js not found. Please run this script from the server directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "✅ Starting server with NODE_ENV=$NODE_ENV"
echo "📊 Server will be available at: http://localhost:5050"
echo "🔍 Health check: http://localhost:5050/api/ping"
echo ""

# Start the server with proper error handling
NODE_ENV=$NODE_ENV node index.js 