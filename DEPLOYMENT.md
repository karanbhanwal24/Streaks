# Deployment Guide for Habit Tracker

## Overview
This guide will help you deploy your Habit Tracker application:
- **Backend**: Deploy to Render
- **Frontend**: Deploy to Vercel

## Prerequisites
- GitHub repository set up ✅
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- PostgreSQL database (Render PostgreSQL, Neon, Supabase, or similar)

---

## Step 1: Set Up PostgreSQL (Database)

1. Create a PostgreSQL database with your hosting provider.
2. Copy its connection string (it will look like):
   ```
   postgresql://username:<password>@host:5432/habit_tracker
   ```
3. Replace the placeholders with your database credentials.

---

## Step 2: Deploy Backend to Render

### 2.1 Create Render Account
- Sign up at https://render.com using your GitHub account

### 2.2 Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `TamilselvanRaman/Habit-Tracking`
3. Configure the service:
   - **Name**: `habit-tracker-backend` (or any name you prefer)
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### 2.3 Add Environment Variables
In Render dashboard, go to "Environment" tab and add:
- **Key**: `DATABASE_URL`
  **Value**: Your PostgreSQL connection string from Step 1
  
- **Key**: `JWT_SECRET`  
  **Value**: A random secure string (e.g., `your-super-secret-jwt-key-12345`)
  
- **Key**: `PORT`  
  **Value**: `5000`
  
- **Key**: `NODE_ENV`  
  **Value**: `production`

### 2.4 Deploy
- Click "Create Web Service"
- Wait for deployment to complete (5-10 minutes)
- Copy your backend URL (e.g., `https://habit-tracker-backend-xxxx.onrender.com`)

---

## Step 3: Deploy Frontend to Vercel

### 3.1 Update Environment Variable
Before deploying, update the frontend environment variable:

1. Edit `frontend/.env.production` and replace with your actual Render backend URL:
   ```
   VITE_API_URL=https://your-actual-backend-url.onrender.com
   ```

2. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push
   ```

### 3.2 Deploy to Vercel

1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New" → "Project"
3. Import your repository: `TamilselvanRaman/Habit-Tracking`
4. Vercel should auto-detect the configuration from `vercel.json`
5. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL from Step 2.4
6. Click "Deploy"
7. Wait for deployment (2-5 minutes)

### 3.3 Get Your Frontend URL
- Vercel will provide a URL like: `https://habit-tracking-xxxx.vercel.app`
- This is your live application URL!

---

## Step 4: Update Backend CORS Settings

After deploying frontend, update your backend to allow CORS from your Vercel URL:

1. Edit `backend/server.js` CORS configuration to include your Vercel URL
2. Commit and push changes
3. Render will automatically redeploy

---

## Testing Your Deployment

1. Open your Vercel URL in a browser
2. Try to register a new account
3. Login and test creating habits
4. Verify all features work correctly

---

## Troubleshooting

### Frontend can't connect to Backend
- Check that `VITE_API_URL` environment variable is set correctly in Vercel
- Verify backend is running on Render
- Check backend CORS settings

### Backend Database Errors
- Verify the PostgreSQL connection string is correct
- Ensure the database permits connections from the application host

### Build Failures
- Check build logs in Vercel/Render dashboard
- Verify all dependencies are in `package.json`

---

## Important Notes

⚠️ **Free Tier Limitations**:
- Render free tier may sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Consider upgrading for production use

✅ **Auto-Deploy**:
- Both Vercel and Render will auto-deploy when you push to GitHub main branch

---

## Local Development

To run locally:

```bash
# Backend
cd backend
npm install
# Create .env file with DATABASE_URL and JWT_SECRET
npm run dev

# Frontend (in new terminal)
cd frontend
npm install
npm run dev
```

---

## Support

If you encounter issues:
1. Check deployment logs in Vercel/Render dashboard
2. Verify all environment variables are set correctly
3. Ensure the PostgreSQL database permits connections from the application host
