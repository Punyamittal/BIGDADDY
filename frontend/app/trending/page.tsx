'use client'

import { useEffect, useState } from 'react'
import { statsApi, postsApi } from '@/lib/api'
import { Header } from '@/components/Header'
import { PostCard } from '@/components/PostCard'
import { Loader2, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TrendingPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await postsApi.getAll({ sort: 'trending', limit: 50 })
        setPosts(response.data.posts)
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Failed to load trending posts')
      } finally {
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex items-center gap-3">
          <TrendingUp className="w-8 h-8 text-vit-primary" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Trending Posts
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-vit-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No trending posts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


