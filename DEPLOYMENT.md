# Detailed Deployment Guide

This guide provides step-by-step instructions for deploying the MERN Todo application to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [MongoDB Atlas Setup](#mongodb-atlas-setup)
3. [Backend Deployment (Render)](#backend-deployment-render)
4. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
5. [CI/CD Configuration](#cicd-configuration)
6. [Post-Deployment Tasks](#post-deployment-tasks)
7. [Troubleshooting](#troubleshooting)
8. [Rollback Procedures](#rollback-procedures)

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas account created
- [ ] Render account created
- [ ] Vercel account created
- [ ] Sentry account created (optional)
- [ ] All sensitive data removed from code
- [ ] Environment variables documented

## MongoDB Atlas Setup

### Step 1: Create Account and Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Click "Build a Database"
4. Choose "Free Shared Cluster" (M0)
5. Select your preferred cloud provider and region
6. Click "Create Cluster"

### Step 2: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with a strong password
4. Set "Built-in Role" to "Read and write to any database"
5. Click "Add User"

### Step 3: Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict to specific IPs
4. Click "Confirm"

### Step 4: Get Connection String

1. Go to "Database" → "Connect"
2. Select "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `mern-todo`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mern-todo?retryWrites=true&w=majority
```

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure your `backend/package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "start": "node src/server.js",
       "dev": "nodemon src/server.js"
     }
   }
   ```

2. Create `backend/logs` directory (if not exists):
   ```bash
   mkdir -p backend/logs
   ```

### Step 2: Create Render Service

1. Log in to [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   ```
   Name: mern-todo-api
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Root Directory: backend
   Build Command: npm install
   Start Command: npm start
   ```

### Step 3: Configure Environment Variables

Add the following environment variables in Render:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=<your-mongodb-atlas-connection-string>
JWT_SECRET=<generate-strong-random-string>
JWT_EXPIRE=30d
FRONTEND_URL=<will-add-after-frontend-deployment>
LOG_LEVEL=info
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Step 4: Deploy

1. Click "Create Web Service"
2. Render will build and deploy your backend
3. Wait for deployment to complete (5-10 minutes)
4. Copy your backend URL (e.g., `https://mern-todo-api.onrender.com`)

### Step 5: Test Backend

Test your backend API:
```bash
curl https://your-backend-url.onrender.com/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend

1. Update `frontend/vite.config.js` if needed:
   ```javascript
   export default defineConfig({
     plugins: [react()],
     build: {
       outDir: 'dist',
       sourcemap: false
     }
   })
   ```

### Step 2: Create Vercel Project

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

### Step 3: Configure Environment Variables

Add environment variables in Vercel:

```env
VITE_API_URL=<your-render-backend-url>/api
```

Example:
```env
VITE_API_URL=https://mern-todo-api.onrender.com/api
```

### Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Wait for deployment to complete (2-5 minutes)
4. Copy your frontend URL (e.g., `https://mern-todo.vercel.app`)

### Step 5: Update Backend CORS

Go back to Render and update `FRONTEND_URL`:
```env
FRONTEND_URL=https://your-frontend-url.vercel.app
```

This allows CORS requests from your frontend.

### Step 6: Test Application

1. Visit your frontend URL
2. Register a new account
3. Create a todo
4. Test all CRUD operations

## CI/CD Configuration

### GitHub Actions Setup

The workflows are already configured in `.github/workflows/`. To enable them:

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. Go to your repository → "Actions" tab
3. Verify workflows are running

### GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to repository → "Settings" → "Secrets and variables" → "Actions"
2. Click "New repository secret"
3. Add the following secrets:

```
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
VITE_API_URL=<your-backend-url>/api
```

### Auto-Deployment Setup

**Render:**
1. Go to your service settings
2. Enable "Auto-Deploy" from main branch
3. Each push to main will trigger deployment

**Vercel:**
1. Vercel automatically deploys on push to main
2. Configure branch settings in Vercel dashboard

## Post-Deployment Tasks

### 1. Set Up Custom Domains (Optional)

**Backend (Render):**
1. Go to service → "Settings" → "Custom Domains"
2. Add your domain
3. Configure DNS records

**Frontend (Vercel):**
1. Go to project → "Settings" → "Domains"
2. Add your domain
3. Vercel will provide DNS records

### 2. Configure Monitoring

**Sentry Setup:**
1. Create projects at [Sentry](https://sentry.io)
2. Get DSN for backend and frontend
3. Add to environment variables:
   - Render: Add `SENTRY_DSN`
   - Vercel: Add `VITE_SENTRY_DSN`

**Uptime Monitoring:**
- Set up monitoring at [UptimeRobot](https://uptimerobot.com)
- Monitor: `https://your-api.onrender.com/api/health`

### 3. Enable HTTPS

Both Render and Vercel provide automatic HTTPS:
- Render: SSL certificate auto-generated
- Vercel: SSL certificate auto-provisioned

### 4. Database Backups

Configure MongoDB Atlas backups:
1. Go to Atlas → "Backup"
2. Enable automatic backups
3. Set backup schedule

### 5. Performance Optimization

**Backend:**
- Enable connection pooling (already configured)
- Monitor memory usage in Render dashboard
- Consider upgrading plan if needed

**Frontend:**
- Vercel automatically handles CDN
- Enable edge caching for static assets
- Monitor Core Web Vitals in Vercel Analytics

## Troubleshooting

### Common Issues

**Issue: Backend won't connect to MongoDB**
```
Solution:
1. Verify MongoDB URI is correct
2. Check IP whitelist in Atlas (should be 0.0.0.0/0)
3. Verify database user has correct permissions
4. Check Render logs for connection errors
```

**Issue: CORS errors in browser**
```
Solution:
1. Verify FRONTEND_URL matches your Vercel URL
2. Ensure no trailing slashes in URLs
3. Restart Render service after changing env vars
```

**Issue: Frontend can't reach backend**
```
Solution:
1. Verify VITE_API_URL is correct in Vercel
2. Check backend is running at /api endpoint
3. Test backend directly with curl
4. Check browser console for errors
```

**Issue: Authentication not working**
```
Solution:
1. Verify JWT_SECRET is set in Render
2. Check token in browser localStorage
3. Verify token format (Bearer <token>)
4. Check backend logs for auth errors
```

**Issue: Build failing on Render**
```
Solution:
1. Check Node version compatibility
2. Verify all dependencies in package.json
3. Check for missing environment variables
4. Review build logs in Render dashboard
```

### Debugging Tools

**Backend Logs (Render):**
```bash
# View in Render dashboard or via CLI
render logs --service mern-todo-api --tail
```

**Frontend Logs (Render):**
```bash
# View in Render dashboard or via CLI
render logs <https://deployment-and-devops-essentials-kim-dr-2.onrender.com>
```

**Database Monitoring:**
- MongoDB Atlas → Metrics
- Check connection count, operations, storage

## Rollback Procedures

### Quick Rollback

**Render:**
1. Go to service → "Events"
2. Find previous successful deployment
3. Click "Redeploy"

**Vercel:**
1. Go to project → "Deployments"
2. Find previous deployment
3. Click "Promote to Production"

### Git Rollback

```bash
# Revert last commit
git revert HEAD
git push origin main

# Or rollback to specific commit
git reset --hard <commit-hash>
git push origin main --force
```

### Database Rollback

1. Go to MongoDB Atlas → "Backup"
2. Select restore point
3. Restore to same cluster or new cluster
4. Update MONGODB_URI if needed

## Maintenance Schedule

### Daily
- [ ] Check error tracking (Sentry)
- [ ] Monitor uptime (UptimeRobot)

### Weekly
- [ ] Review application logs
- [ ] Check performance metrics
- [ ] Update dependencies if needed

### Monthly
- [ ] Database backup verification
- [ ] Security audit
- [ ] Performance optimization review

### Quarterly
- [ ] Update Node.js version
- [ ] Major dependency updates
- [ ] Infrastructure cost review

## Support

For issues or questions:
1. Check the [README](./README.md)
2. Review [GitHub Issues](https://github.com/PLP-MERN-Stack-Development/deployment-and-devops-essentials-Kim-dr.git/issues)
3. Contact: kagasikimberly@gmail.com

---

**Last Updated**: [13/11/2025]
**Deployment Status**: ✅ Active