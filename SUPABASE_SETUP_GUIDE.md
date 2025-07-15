# Supabase Setup Guide - Fix "Invalid API Key" Error

## 🔧 Step 1: Get Your Supabase Credentials

1. **Go to your Supabase Dashboard**
   - Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project (or create a new one)

2. **Get your Project URL**
   - Go to Settings → API
   - Copy the "Project URL" (looks like: `https://your-project-id.supabase.co`)

3. **Get your API Key**
   - In the same Settings → API page
   - Copy the "anon public" key (starts with `eyJ...`)

## 🔧 Step 2: Create Environment File

1. **Create `.env` file in the client directory**
   ```bash
   cd client
   touch .env
   ```

2. **Add your credentials to `.env`**
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   ⚠️ **Important**: Replace with your actual values!

## 🔧 Step 3: Set Up Database

1. **Go to Supabase SQL Editor**
   - In your Supabase dashboard
   - Click "SQL Editor" in the left sidebar

2. **Run the database setup**
   - Copy the contents of `database_setup.sql`
   - Paste into the SQL editor
   - Click "Run" to execute

3. **Verify tables were created**
   - Go to "Table Editor" in the sidebar
   - You should see: `campaigns`, `influencers`, `influencer_performance`, `dashboard_metrics`

## 🔧 Step 4: Restart Development Server

```bash
# Stop your current server (Ctrl+C)
# Then restart it
npm run dev
# or
yarn dev
# or
pnpm dev
```

## 🔧 Step 5: Test Connection

1. **Add the test component temporarily**
   ```jsx
   // In your main dashboard or any page
   import SupabaseTest from './components/SupabaseTest';
   
   // Add this to your JSX
   <SupabaseTest />
   ```

2. **Check the browser console**
   - Open Developer Tools (F12)
   - Look for any error messages
   - The test component will show connection status

## 🔧 Step 6: Common Issues & Solutions

### ❌ "Missing Supabase configuration"
**Solution**: Create the `.env` file with correct credentials

### ❌ "Invalid API key"
**Solution**: 
- Double-check your API key is correct
- Make sure you're using the "anon public" key, not the service role key
- Ensure no extra spaces or characters

### ❌ "JWT expired"
**Solution**: 
- Get a fresh API key from your Supabase dashboard
- Update your `.env` file

### ❌ "Table doesn't exist"
**Solution**: 
- Run the `database_setup.sql` script in Supabase SQL Editor
- Check that all tables were created successfully

## 🔧 Step 7: Verify Everything Works

After setup, your dashboard should:
- ✅ Show loading states while fetching data
- ✅ Display real data from your database
- ✅ Allow searching and pagination
- ✅ Show proper error messages if something goes wrong

## 🔧 Troubleshooting Checklist

- [ ] `.env` file exists in `client/` directory
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] Development server was restarted
- [ ] Database tables were created
- [ ] No typos in environment variables
- [ ] Using the correct project URL and API key

## 🔧 Need Help?

If you're still having issues:
1. Check the browser console for specific error messages
2. Verify your Supabase project is active
3. Make sure you're using the correct project credentials
4. Try creating a new Supabase project if needed 