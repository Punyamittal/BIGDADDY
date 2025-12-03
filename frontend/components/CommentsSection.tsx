'use client'

import { useEffect, useState } from 'react'
import { commentsApi, votesApi, reportsApi } from '@/lib/api'
import { formatDistanceToNow } from 'date-fns'
import { ArrowUp, ArrowDown, Flag } from 'lucide-react'
import toast from 'react-hot-toast'
import { CreateCommentForm } from './CreateCommentForm'

interface Comment {
  _id: string
  content: string
  authorName: string
  upvotes: number
  downvotes: number
  voteScore: number
  createdAt: string
  userVote?: string | null
  replies?: Comment[]
  repliesCount: number
}

interface CommentsSectionProps {
  postId: string
}

export function CommentsSection({ postId }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchComments = async () => {
    try {
      const response = await commentsApi.getByPostId(postId)
      setComments(response.data.comments)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleVote = async (commentId: string, voteType: 'upvote' | 'downvote') => {
    try {
      await votesApi.vote({
        targetType: 'comment',
        targetId: commentId,
        voteType,
      })
      fetchComments() // Refresh comments to get updated votes
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to vote')
    }
  }

  const handleReport = async (commentId: string) => {
    if (!confirm('Report this comment for inappropriate content?')) return

    try {
      await reportsApi.create({
        targetType: 'comment',
        targetId: commentId,
        reason: 'inappropriate',
      })
      toast.success('Report submitted. Thank you!')
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to report comment')
    }
  }

  const onCommentAdded = () => {
    fetchComments()
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <p className="text-gray-500">Loading comments...</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Comments ({comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0)})
      </h2>

      <CreateCommentForm postId={postId} onCommentAdded={onCommentAdded} />

      <div className="mt-6 space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onVote={handleVote}
              onReport={handleReport}
              postId={postId}
              onReplyAdded={onCommentAdded}
            />
          ))
        )}
      </div>
    </div>
  )
}

function CommentItem({
  comment,
  onVote,
  onReport,
  postId,
  onReplyAdded,
}: {
  comment: Comment
  onVote: (id: string, type: 'upvote' | 'downvote') => void
  onReport: (id: string) => void
  postId: string
  onReplyAdded: () => void
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-1">
          <button
            onClick={() => onVote(comment._id, 'upvote')}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              comment.userVote === 'upvote' ? 'text-vit-primary' : 'text-gray-400'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
          <span className={`text-xs font-semibold ${
            comment.voteScore > 0 ? 'text-green-600' : comment.voteScore < 0 ? 'text-red-600' : 'text-gray-500'
          }`}>
            {comment.voteScore}
          </span>
          <button
            onClick={() => onVote(comment._id, 'downvote')}
            className={`p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              comment.userVote === 'downvote' ? 'text-red-500' : 'text-gray-400'
            }`}
          >
            <ArrowDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {comment.authorName}
            </span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
            </span>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
            {comment.content}
          </p>

          <div className="flex items-center gap-4 text-xs text-gray-500">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="hover:text-vit-primary transition-colors"
            >
              Reply
            </button>
            <button
              onClick={() => onReport(comment._id)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Flag className="w-3 h-3" />
              Report
            </button>
          </div>

          {showReplyForm && (
            <div className="mt-3">
              <CreateCommentForm
                postId={postId}
                parentCommentId={comment._id}
                onCommentAdded={() => {
                  setShowReplyForm(false)
                  onReplyAdded()
                }}
              />
            </div>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onVote={onVote}
                  onReport={onReport}
                  postId={postId}
                  onReplyAdded={onReplyAdded}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

