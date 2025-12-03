# Deployment Guide

This guide covers deploying the VIT News platform to production.

## Prerequisites

- MongoDB database (MongoDB Atlas recommended for production)
- Vercel account (for frontend)
- Render/Railway account (for backend)
- Domain name (optional)

## Backend Deployment (Render/Railway)

### Option 1: Render

1. **Create a new Web Service**
   - Connect your GitHub repository
   - Select the `backend` directory as the root directory
   - Build command: `npm install`
   - Start command: `npm start`

2. **Environment Variables**
   Add these in Render dashboard:
   ```
   PORT=5000
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-domain.vercel.app
   ```

3. **Deploy**
   - Render will automatically deploy on every push to main branch
   - Note your backend URL (e.g., `https://vit-news-backend.onrender.com`)

### Option 2: Railway

1. **Create a new project**
   - Connect your GitHub repository
   - Add a new service from the `backend` directory

2. **Environment Variables**
   Add the same variables as Render above

3. **Deploy**
   - Railway will auto-deploy on git push

## Frontend Deployment (Vercel)

1. **Import Project**
   - Go to Vercel dashboard
   - Import your GitHub repository
   - Select the `frontend` directory as the root

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
   ```

3. **Build Settings**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Deploy**
   - Vercel will automatically deploy on every push

## MongoDB Setup

### MongoDB Atlas (Recommended)

1. **Create Cluster**
   - Go to MongoDB Atlas
   - Create a free M0 cluster
   - Choose your region

2. **Database Access**
   - Create a database user
   - Set network access (allow all IPs for development, specific IPs for production)

3. **Connection String**
   - Get your connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/vitnews`

### Local MongoDB (Development)

```bash
# Install MongoDB locally
# Then use connection string:
mongodb://localhost:27017/vitnews
```

## Post-Deployment Checklist

- [ ] Backend is accessible and health check returns OK
- [ ] Frontend can connect to backend API
- [ ] MongoDB connection is working
- [ ] Anonymous authentication is working
- [ ] Posts can be created and viewed
- [ ] Comments and votes are working
- [ ] Dark mode toggle works
- [ ] Content filtering is active
- [ ] Rate limiting is enabled

## Custom Domain Setup

### Backend (Render)

1. Go to your service settings
2. Add custom domain
3. Update CORS_ORIGIN in environment variables

### Frontend (Vercel)

1. Go to project settings
2. Add your domain
3. Update DNS records as instructed
4. Update NEXT_PUBLIC_API_URL if needed

## Monitoring & Maintenance

### Recommended Tools

- **Error Tracking**: Sentry
- **Analytics**: Google Analytics or Plausible
- **Uptime Monitoring**: UptimeRobot
- **Logs**: Render/Railway built-in logs

### Database Backups

- MongoDB Atlas: Automatic backups (paid plans)
- Manual backups: Use `mongodump` command

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT_SECRET (32+ characters)
   - Rotate secrets periodically

2. **Rate Limiting**
   - Already implemented in backend
   - Adjust limits in `routes/posts.js` and `routes/comments.js` if needed

3. **Content Moderation**
   - Review reported content regularly
   - Consider adding AI moderation (OpenAI, Perspective API)

4. **CORS**
   - Only allow your frontend domain
   - Don't use wildcard (*) in production

## Scaling Considerations

- **Database**: Upgrade MongoDB Atlas tier as needed
- **Backend**: Render/Railway auto-scales, but monitor usage
- **CDN**: Vercel provides CDN automatically
- **Caching**: Consider Redis for session/cache management

## Troubleshooting

### Backend not connecting to MongoDB
- Check connection string format
- Verify network access in MongoDB Atlas
- Check environment variables

### CORS errors
- Verify CORS_ORIGIN matches frontend URL exactly
- Check backend logs for CORS errors

### Frontend can't reach backend
- Verify NEXT_PUBLIC_API_URL is correct
- Check backend is running and accessible
- Verify CORS settings

## Support

For issues, check:
- Backend logs in Render/Railway dashboard
- Frontend build logs in Vercel
- Browser console for frontend errors
- Network tab for API errors


