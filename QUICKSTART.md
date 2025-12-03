# Quick Start Guide

Get the VIT News platform up and running in minutes!

## Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

Or use the convenience script:
```bash
npm run install:all
```

### 2. Set Up Environment Variables

#### Backend
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitnews
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vitnews
```

#### Frontend
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services panel
```

**MongoDB Atlas:**
- Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Update `MONGODB_URI` in `backend/.env`

### 4. Run the Application

**Option 1: Run both together (recommended)**
```bash
npm run dev
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## First Steps

1. **Visit the site**: Open http://localhost:3000
2. **Create a post**: Click "New Post" button
3. **Explore categories**: Use the sidebar to filter by category
4. **Interact**: Upvote, comment, and share posts

## Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `MONGODB_URI` in `backend/.env`
- Check if port 5000 is available

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `frontend/.env.local`
- Check browser console for CORS errors

### MongoDB connection errors
- Verify connection string format
- Check network access (for Atlas)
- Ensure MongoDB service is running (for local)

### Port already in use
- Change `PORT` in `backend/.env`
- Update `NEXT_PUBLIC_API_URL` accordingly
- Or kill the process using the port

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Automatic with Next.js
- Backend: Uses nodemon for auto-restart

### Database Reset
To clear all data:
```bash
# Connect to MongoDB
mongosh

# Use the database
use vitnews

# Drop collections
db.posts.drop()
db.comments.drop()
db.votes.drop()
db.reports.drop()
db.users.drop()
```

### Testing API Endpoints
Use tools like:
- Postman
- Insomnia
- curl
- Browser DevTools Network tab

Example API call:
```bash
curl http://localhost:5000/api/posts
```

## Next Steps

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Review [IMPROVEMENTS.md](./IMPROVEMENTS.md) for enhancement ideas

## Getting Help

1. Check the documentation files
2. Review error messages in console/logs
3. Check GitHub issues (if repository is public)
4. Review MongoDB and Next.js documentation

## Common Commands

```bash
# Development
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run frontend only
npm run dev:backend      # Run backend only

# Production
npm run build            # Build frontend
cd backend && npm start   # Start backend in production

# Installation
npm run install:all      # Install all dependencies
```

Happy coding! 🚀


