# Architecture Documentation

## System Overview

VIT News is a full-stack anonymous news and discussion platform built with:
- **Frontend**: Next.js 14 (React) with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for live updates
- **Styling**: Tailwind CSS with dark mode support

## Project Structure

```
vnews/
├── backend/                 # Express.js backend
│   ├── models/             # MongoDB models
│   │   ├── Post.js
│   │   ├── Comment.js
│   │   ├── Vote.js
│   │   ├── Report.js
│   │   └── User.js
│   ├── routes/             # API routes
│   │   ├── posts.js
│   │   ├── comments.js
│   │   ├── votes.js
│   │   ├── reports.js
│   │   ├── auth.js
│   │   ├── admin.js
│   │   └── stats.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   └── contentFilter.js
│   └── server.js           # Entry point
│
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── post/[id]/
│   │   └── globals.css
│   ├── components/        # React components
│   │   ├── Header.tsx
│   │   ├── PostFeed.tsx
│   │   ├── PostCard.tsx
│   │   ├── CommentsSection.tsx
│   │   └── ...
│   └── lib/               # Utilities
│       ├── api.ts
│       └── auth.ts
│
└── README.md
```

## Database Schema

### Post Model
```javascript
{
  title: String (5-200 chars, required)
  content: String (10-5000 chars, required)
  category: Enum (news, campus-updates, academics, events, confessions, clubs, placements, lost-found, general)
  authorId: String (anonymous ID)
  authorName: String (default: 'Anonymous')
  upvotes: Number (default: 0)
  downvotes: Number (default: 0)
  voteScore: Number (upvotes - downvotes)
  commentsCount: Number
  views: Number
  shares: Number
  reports: Number
  isReported: Boolean
  isRemoved: Boolean
  isPinned: Boolean
  images: [String]
  tags: [String]
  trendingScore: Number (calculated)
  createdAt: Date
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  postId: ObjectId (ref: Post)
  content: String (1-1000 chars, required)
  authorId: String
  authorName: String
  upvotes: Number
  downvotes: Number
  voteScore: Number
  reports: Number
  isReported: Boolean
  isRemoved: Boolean
  parentCommentId: ObjectId (ref: Comment, nullable)
  repliesCount: Number
  createdAt: Date
  updatedAt: Date
}
```

### Vote Model
```javascript
{
  userId: String (required)
  targetType: Enum ('post', 'comment')
  targetId: ObjectId (required)
  voteType: Enum ('upvote', 'downvote')
  createdAt: Date
}
// Unique index on (userId, targetId, targetType)
```

### Report Model
```javascript
{
  userId: String
  targetType: Enum ('post', 'comment')
  targetId: ObjectId
  reason: Enum (spam, harassment, inappropriate, misinformation, other)
  description: String (optional, max 500)
  status: Enum (pending, reviewed, resolved, dismissed)
  reviewedBy: String (nullable)
  reviewedAt: Date (nullable)
  createdAt: Date
}
```

### User Model
```javascript
{
  anonymousId: String (unique, required)
  username: String (nullable)
  postsCount: Number
  commentsCount: Number
  karma: Number
  isBanned: Boolean
  banReason: String
  lastActivity: Date
  createdAt: Date
}
```

## API Routes

### Posts
- `GET /api/posts` - Get all posts (paginated, filterable by category, sortable)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (rate limited)
- `PUT /api/posts/:id` - Update post (author only)
- `DELETE /api/posts/:id` - Delete post (author only, soft delete)

### Comments
- `GET /api/comments/post/:postId` - Get comments for a post
- `POST /api/comments` - Create comment (rate limited)
- `PUT /api/comments/:id` - Update comment (author only)
- `DELETE /api/comments/:id` - Delete comment (author only)

### Votes
- `POST /api/votes` - Vote on post/comment (toggleable)
- `POST /api/votes/batch` - Get user votes for multiple targets

### Reports
- `POST /api/reports` - Report content (rate limited)
- `GET /api/reports/my-reports` - Get user's reports

### Auth
- `POST /api/auth/anonymous` - Generate anonymous token
- `GET /api/auth/me` - Get current user info

### Admin
- `GET /api/admin/reports` - Get all reports (admin only)
- `PUT /api/admin/reports/:id` - Review report (admin only)
- `DELETE /api/admin/:type/:id` - Remove content (admin only)
- `PUT /api/admin/posts/:id/pin` - Pin/unpin post (admin only)

### Stats
- `GET /api/stats` - Get platform statistics
- `GET /api/stats/trending` - Get trending topics

## Authentication Flow

1. **Anonymous Authentication**
   - User visits site
   - Frontend calls `/api/auth/anonymous`
   - Backend generates random anonymous ID
   - JWT token created with anonymous ID
   - Token stored in localStorage
   - Token sent in Authorization header for all requests

2. **Request Flow**
   - All requests include token in header
   - Middleware extracts userId from token
   - If no token, generates new anonymous ID
   - User record created/retrieved in database

## Content Moderation

1. **Automatic Filtering**
   - Uses `bad-words` library
   - Filters content before saving
   - Returns filtered text if inappropriate

2. **User Reporting**
   - Users can report posts/comments
   - Reports stored in database
   - Admin can review and take action

3. **Rate Limiting**
   - Post creation: 5 per 15 minutes
   - Comment creation: 10 per 5 minutes
   - Reports: 10 per hour

## Trending Algorithm

Trending score calculated as:
```
trendingScore = (
  voteScore * 2 +
  commentsCount * 1.5 +
  views * 0.1 +
  shares * 1
) * timeDecay

timeDecay = 1 / (1 + hoursSinceCreation / 24)
```

## Real-time Updates

- Socket.io used for live feed updates
- New posts/comments broadcast to all connected clients
- Clients join 'feed' room on connection
- Events: `new-post`, `new-comment`

## Frontend Architecture

### State Management
- React hooks (useState, useEffect)
- No global state management (can add Redux/Zustand if needed)

### Routing
- Next.js App Router
- Dynamic routes for post details
- Server-side rendering where beneficial

### Styling
- Tailwind CSS utility classes
- Dark mode via `next-themes`
- Custom VIT color scheme

## Security Features

1. **Input Validation**
   - Express-validator for request validation
   - Content length limits
   - Type checking

2. **Rate Limiting**
   - Prevents spam and abuse
   - Configurable per endpoint

3. **Content Filtering**
   - Automatic profanity filtering
   - Custom word list support

4. **CORS**
   - Configured for specific origins
   - Prevents unauthorized access

5. **Soft Deletes**
   - Content marked as removed, not deleted
   - Allows for recovery/audit

## Performance Optimizations

1. **Database Indexes**
   - Indexed on frequently queried fields
   - Compound indexes for complex queries

2. **Pagination**
   - All list endpoints paginated
   - Prevents large data transfers

3. **Infinite Scroll**
   - Frontend loads more content on scroll
   - Reduces initial load time

4. **Caching** (Future)
   - Can add Redis for session/cache
   - CDN for static assets (Vercel provides)

## Future Enhancements

1. **Image Uploads**
   - Multer already included
   - Need to add storage (S3/Cloudinary)
   - Image processing/optimization

2. **AI Moderation**
   - Integrate OpenAI/Perspective API
   - Automatic content classification

3. **Notifications**
   - Real-time notifications for replies/votes
   - Email notifications (optional)

4. **Search**
   - Full-text search with MongoDB
   - Filter by tags, date, category

5. **User Profiles**
   - Optional username system
   - User karma/statistics
   - Post/comment history

6. **Polls**
   - Create polls in posts
   - Vote tracking

7. **Chat Rooms**
   - Anonymous chat rooms
   - Topic-based discussions


