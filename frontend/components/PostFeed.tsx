'use client'

import { useEffect, useState, useCallback } from 'react'
import { PostCard } from './PostCard'
import { postsApi } from '@/lib/api'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'

interface Post {
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

export function PostFeed() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') || 'newest'

  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPosts = useCallback(async (pageNum: number, reset: boolean = false) => {
    try {
      if (pageNum === 1) setLoading(true)
      else setLoadingMore(true)

      const params: any = {
        page: pageNum,
        limit: 20,
        sort,
      }
      if (category && category !== 'all') {
        params.category = category
      }

      const response = await postsApi.getAll(params)
      const newPosts = response.data.posts

      if (reset) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(response.data.pagination.page < response.data.pagination.pages)
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load posts')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [category, sort])

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    fetchPosts(1, true)
  }, [category, sort])

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      fetchPosts(nextPage)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.offsetHeight - 1000
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [page, hasMore, loadingMore])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-vit-primary" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No posts found. Be the first to post!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-vit-primary" />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <div className="text-center py-4 text-gray-500 dark:text-gray-400">
          No more posts to load
        </div>
      )}
    </div>
  )
}


