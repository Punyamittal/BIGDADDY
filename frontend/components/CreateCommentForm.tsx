'use client'

import { useState } from 'react'
import { commentsApi } from '@/lib/api'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'

interface CreateCommentFormProps {
  postId: string
  parentCommentId?: string
  onCommentAdded: () => void
}

export function CreateCommentForm({
  postId,
  parentCommentId,
  onCommentAdded,
}: CreateCommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) {
      toast.error('Please enter a comment')
      return
    }

    setLoading(true)
    try {
      await commentsApi.create({
        postId,
        content,
        parentCommentId,
      })
      setContent('')
      toast.success('Comment posted!')
      onCommentAdded()
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to post comment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={parentCommentId ? 'Write a reply...' : 'Write a comment...'}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none min-h-[80px]"
          maxLength={1000}
          rows={3}
        />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-4 py-2 bg-vit-primary text-white rounded-lg hover:bg-vit-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {content.length}/1000 characters
      </p>
    </form>
  )
}


