# Server Troubleshooting Guide

## Common Issues and Solutions

### 1. "Unable to fetch influencers" Error

**Symptoms:**
- Frontend shows "unable to fetch influencers" error
- Backend logs show "TypeError: fetch failed"
- API returns 500 status codes

**Solutions:**

#### A. Rate Limiting Issue
```bash
# Ensure NODE_ENV is set to development
export NODE_ENV=development

# Restart the server
cd server
./start.sh
```

#### B. Port Already in Use
```bash
# Kill processes on port 5050
lsof -ti:5050 | xargs kill -9

# Or use the startup script
./start.sh
```

#### C. Database Connection Issues
```bash
# Check if Supabase is accessible
curl -s https://uojpdnzjinmbpamxtxco.supabase.co/rest/v1/

# Restart with proper environment
NODE_ENV=development node index.js
```

### 2. Server Won't Start

**Symptoms:**
- "Cannot find module" errors
- Port already in use errors

**Solutions:**

#### A. Missing Dependencies
```bash
cd server
npm install
```

#### B. Wrong Directory
```bash
# Ensure you're in the server directory
cd /path/to/mern-monorepo/server
ls index.js  # Should show the file
```

#### C. Use the Startup Script
```bash
cd server
chmod +x start.sh
./start.sh
```

### 3. Database Errors

**Symptoms:**
- "duplicate key value violates unique constraint"
- "TypeError: fetch failed"

**Solutions:**

#### A. Clear Database Cache
```bash
# Restart the server to refresh connections
./start.sh
```

#### B. Check Supabase Status
- Visit https://status.supabase.com
- Check if there are any ongoing issues

### 4. Performance Issues

**Symptoms:**
- Slow API responses
- Timeout errors

**Solutions:**

#### A. Increase Rate Limits (Development)
The server automatically disables rate limiting in development mode.

#### B. Check Network Connectivity
```bash
# Test API response time
curl -w "@curl-format.txt" -o /dev/null -s "http://localhost:5050/api/ping"
```

## Quick Fix Commands

### Start Server Properly
```bash
cd server
./start.sh
```

### Restart with Clean State
```bash
cd server
pkill -f "node index.js"
sleep 2
NODE_ENV=development node index.js
```

### Check Server Status
```bash
curl -s http://localhost:5050/api/ping
```

### View Server Logs
```bash
# If using nodemon
npm run dev

# If using node directly
NODE_ENV=development node index.js
```

## Environment Variables

Make sure these are set correctly:

```bash
export NODE_ENV=development
export SUPABASE_URL=https://uojpdnzjinmbpamxtxco.supabase.co
export SUPABASE_ANON_KEY=your_anon_key_here
```

## Contact Support

If issues persist:
1. Check the server logs for detailed error messages
2. Verify Supabase connection and credentials
3. Ensure all dependencies are installed
4. Try the startup script: `./start.sh` 