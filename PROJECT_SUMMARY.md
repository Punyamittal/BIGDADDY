# VIT News - Project Summary

## Overview

VIT News is a complete full-stack anonymous news and discussion platform built for VIT Chennai students. It allows completely anonymous posting, discussion, and sharing of real-time campus updates.

## What's Included

### ✅ Complete Backend API
- Express.js server with MongoDB
- RESTful API endpoints for all features
- Real-time updates with Socket.io
- Content moderation and filtering
- Rate limiting and security
- Admin panel routes

### ✅ Modern Frontend
- Next.js 14 with TypeScript
- Responsive design with Tailwind CSS
- Dark/Light mode support
- Infinite scroll feed
- Real-time updates
- Beautiful UI components

### ✅ Core Features Implemented
- ✅ Anonymous posting (no login required)
- ✅ Category-based feed (9 categories)
- ✅ Upvote/Downvote system
- ✅ Nested comments with replies
- ✅ Share post links
- ✅ Report/flag content
- ✅ Content filtering (profanity filter)
- ✅ Trending algorithm
- ✅ Real-time feed updates
- ✅ Post views tracking
- ✅ Admin moderation tools

### ✅ Database Models
- Post model with trending score
- Comment model with nested replies
- Vote model with unique constraints
- Report model for moderation
- User model for anonymous users

### ✅ Security Features
- JWT-based anonymous authentication
- Rate limiting on all endpoints
- Content filtering
- CORS protection
- Input validation
- Soft deletes for audit trail

## Project Structure

```
vnews/
├── backend/              # Express.js API
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth, filtering
│   └── server.js        # Entry point
│
├── frontend/            # Next.js app
│   ├── app/            # Pages
│   ├── components/     # React components
│   └── lib/            # Utilities
│
└── Documentation/        # Guides and docs
```

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Real-time**: Socket.io
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS with custom VIT theme
- **Deployment**: Vercel (frontend), Render/Railway (backend)

## Key Features

### 1. Anonymous System
- No registration required
- Random anonymous IDs
- JWT tokens for session management
- Complete privacy

### 2. Content Categories
- News
- Campus Updates
- Academics
- Events
- Confessions
- Clubs & Activities
- Placements
- Lost & Found
- General

### 3. Interactive Features
- Upvote/Downvote posts and comments
- Nested comment threads
- Share posts via link
- Report inappropriate content
- View counts
- Trending algorithm

### 4. Moderation
- Automatic profanity filtering
- User reporting system
- Admin review panel
- Rate limiting
- Soft deletes

### 5. User Experience
- Infinite scroll
- Category filtering
- Sort by newest/trending/top
- Dark/Light mode
- Responsive design
- Real-time updates

## API Endpoints

### Posts
- `GET /api/posts` - List posts (paginated, filterable)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comments
- `GET /api/comments/post/:postId` - Get comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Votes
- `POST /api/votes` - Vote on post/comment
- `POST /api/votes/batch` - Get user votes

### Reports
- `POST /api/reports` - Report content
- `GET /api/reports/my-reports` - Get user reports

### Auth
- `POST /api/auth/anonymous` - Get anonymous token
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/reports` - List reports
- `PUT /api/admin/reports/:id` - Review report
- `DELETE /api/admin/:type/:id` - Remove content
- `PUT /api/admin/posts/:id/pin` - Pin post

### Stats
- `GET /api/stats` - Platform statistics
- `GET /api/stats/trending` - Trending topics

## Frontend Pages

- `/` - Main feed with posts
- `/post/[id]` - Post detail with comments
- `/trending` - Trending posts page

## Database Schema

### Post
- Title, content, category
- Vote counts, comment count, views
- Trending score (calculated)
- Author info (anonymous)
- Flags (reported, removed, pinned)

### Comment
- Content, post reference
- Nested replies support
- Vote counts
- Author info (anonymous)

### Vote
- User ID, target type, target ID
- Vote type (upvote/downvote)
- Unique constraint per user/target

### Report
- Target type and ID
- Reason and description
- Status and review info

### User
- Anonymous ID
- Statistics (posts, comments, karma)
- Ban status

## Getting Started

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Set up environment variables**:
   - Copy `backend/.env.example` to `backend/.env`
   - Copy `frontend/.env.local.example` to `frontend/.env.local`
   - Update with your MongoDB connection

3. **Start MongoDB** (local or use Atlas)

4. **Run the application**:
   ```bash
   npm run dev
   ```

5. **Access**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions.

## Deployment

### Frontend (Vercel)
1. Import GitHub repository
2. Set root directory to `frontend`
3. Add `NEXT_PUBLIC_API_URL` environment variable
4. Deploy

### Backend (Render/Railway)
1. Create new service
2. Set root directory to `backend`
3. Add environment variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete guide.

## Documentation Files

- **README.md** - Project overview
- **QUICKSTART.md** - Getting started guide
- **ARCHITECTURE.md** - System architecture and design
- **DEPLOYMENT.md** - Production deployment guide
- **IMPROVEMENTS.md** - Suggested enhancements
- **PROJECT_SUMMARY.md** - This file

## Future Enhancements

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for a comprehensive list, including:
- AI-based content moderation
- Image uploads
- Full-text search
- Rich text editor
- Notifications system
- Mobile app
- And more...

## License

MIT License - feel free to use and modify for your needs.

## Support

For issues or questions:
1. Check the documentation files
2. Review error logs
3. Check MongoDB and Next.js documentation

---

**Built with ❤️ for VIT Chennai students**


