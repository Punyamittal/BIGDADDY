'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { postsApi, commentsApi } from '@/lib/api'
import { PostCard } from '@/components/PostCard'
import { CommentsSection } from '@/components/CommentsSection'
import { Header } from '@/components/Header'
import { ArrowLeft, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string

  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsApi.getById(postId)
        setPost(response.data)
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load post')
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchPost()
    }
  }, [postId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-vit-primary" />
          </div>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-vit-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to feed
        </button>

        <div className="mb-6">
          <PostCard post={post} />
        </div>

        <CommentsSection postId={postId} />
      </main>
    </div>
  )
}


