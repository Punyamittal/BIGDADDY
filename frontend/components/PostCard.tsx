'use client'

import { useState } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { 
  ArrowUp, 
  ArrowDown, 
  MessageCircle, 
  Eye, 
  Share2, 
  Flag,
  MoreVertical
} from 'lucide-react'
import { votesApi, reportsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { CategoryBadge } from './CategoryBadge'

interface PostCardProps {
  post: {
    _id: string
    title: string
    content: string
    category: string
    authorName: string
    upvotes: number
    downvotes: number
    voteScore: number
    commentsCount: number
    views: number
    createdAt: string
    userVote?: string | null
  }
}

export function PostCard({ post }: PostCardProps) {
  const [voteScore, setVoteScore] = useState(post.voteScore)
  const [userVote, setUserVote] = useState<string | null>(post.userVote || null)
  const [upvotes, setUpvotes] = useState(post.upvotes)
  const [downvotes, setDownvotes] = useState(post.downvotes)

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      const response = await votesApi.vote({
        targetType: 'post',
        targetId: post._id,
        voteType,
      })

      if (response.data.vote) {
        // Vote was added/changed
        if (userVote === voteType) {
          // Toggle off
          setUserVote(null)
          setVoteScore(voteScore + (voteType === 'upvote' ? -1 : 1))
          if (voteType === 'upvote') setUpvotes(upvotes - 1)
          else setDownvotes(downvotes - 1)
        } else {
          // Change vote
          const oldVote = userVote
          setUserVote(voteType)
          
          if (oldVote === 'upvote') {
            setUpvotes(upvotes - 1)
            setDownvotes(downvotes + 1)
            setVoteScore(voteScore - 2)
          } else if (oldVote === 'downvote') {
            setUpvotes(upvotes + 1)
            setDownvotes(downvotes - 1)
            setVoteScore(voteScore + 2)
          } else {
            if (voteType === 'upvote') setUpvotes(upvotes + 1)
            else setDownvotes(downvotes + 1)
            setVoteScore(voteScore + (voteType === 'upvote' ? 1 : -1))
          }
        }
      } else {
        // Vote was removed
        setUserVote(null)
        setVoteScore(voteScore + (voteType === 'upvote' ? -1 : 1))
        if (voteType === 'upvote') setUpvotes(upvotes - 1)
        else setDownvotes(downvotes - 1)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to vote')
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/post/${post._id}`
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleReport = async () => {
    if (!confirm('Report this post for inappropriate content?')) return

    try {
      await reportsApi.create({
        targetType: 'post',
        targetId: post._id,
        reason: 'inappropriate',
      })
      toast.success('Report submitted. Thank you!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to report post')
    }
  }

  const truncatedContent = post.content.length > 300 
    ? post.content.substring(0, 300) + '...' 
    : post.content

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Vote Section */}
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => handleVote('upvote')}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              userVote === 'upvote' ? 'text-vit-primary' : 'text-gray-400'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <span className={`text-sm font-semibold ${
            voteScore > 0 ? 'text-green-600' : voteScore < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {voteScore}
          </span>
          <button
            onClick={() => handleVote('downvote')}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              userVote === 'downvote' ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <CategoryBadge category={post.category} />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {post.authorName}
              </span>
              <span className="text-sm text-gray-400 dark:text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>

          <Link href={`/post/${post._id}`}>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-vit-primary transition-colors">
              {post.title}
            </h2>
          </Link>

          <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-wrap">
            {truncatedContent}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <Link
              href={`/post/${post._id}`}
              className="flex items-center gap-1 hover:text-vit-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {post.commentsCount} comments
            </Link>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.views} views
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-vit-primary transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
            <button
              onClick={handleReport}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Flag className="w-4 h-4" />
              Report
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}


