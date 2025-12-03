'use client'

import { useEffect, useState } from 'react'
import { PostFeed } from '@/components/PostFeed'
import { CreatePostButton } from '@/components/CreatePostButton'
import { CategoryFilter } from '@/components/CategoryFilter'
import { Header } from '@/components/Header'
import { initAnonymousAuth } from '@/lib/auth'
import { useTheme } from 'next-themes'

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    initAnonymousAuth()
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 flex-shrink-0">
            <CategoryFilter />
          </aside>
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Campus Feed
              </h1>
              <CreatePostButton />
            </div>
            <PostFeed />
          </div>
        </div>
      </main>
    </div>
  )
}


