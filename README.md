# VIT Chennai Anonymous News & Discussion Platform

A full-stack web platform for VIT Chennai students that allows completely anonymous posting, discussion, and sharing of real-time campus updates.

## 🚀 Features

- **Anonymous Posting**: No login required, completely anonymous
- **Category-Based Feed**: News, Campus Updates, Academics, Events, Confessions, Clubs, Placements
- **Interactive Features**: Upvote/Downvote, Comments, Share, Report
- **Modern UI**: Clean design with dark/light mode support
- **Moderation Tools**: Auto-filter, spam detection, admin panel
- **Real-time Updates**: WebSocket support for live feed

## 📁 Project Structure

```
vnews/
├── frontend/          # Next.js frontend application
├── backend/           # Express.js backend API
├── package.json       # Root package.json for workspace
└── README.md          # This file
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Anonymous IDs / JWT tokens
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or Atlas)
- npm or yarn

### Quick Setup

**Windows:**
```bash
setup.bat
```

**Linux/macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

### Manual Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env` and update MongoDB connection
   - Copy `frontend/.env.local.example` to `frontend/.env.local`

4. Run development servers:
   ```bash
   npm run dev
   ```

📖 **See [QUICKSTART.md](./QUICKSTART.md) for detailed setup instructions**

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/vitnews
JWT_SECRET=your-secret-key
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📄 License

MIT

# BIGDADDY
