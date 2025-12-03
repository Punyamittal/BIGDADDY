'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Newspaper, 
  GraduationCap, 
  Calendar, 
  Heart, 
  Users, 
  Briefcase,
  Search,
  MessageSquare
} from 'lucide-react'

const categories = [
  { id: 'all', name: 'All', icon: Newspaper },
  { id: 'news', name: 'News', icon: Newspaper },
  { id: 'campus-updates', name: 'Campus Updates', icon: MessageSquare },
  { id: 'academics', name: 'Academics', icon: GraduationCap },
  { id: 'events', name: 'Events', icon: Calendar },
  { id: 'confessions', name: 'Confessions', icon: Heart },
  { id: 'clubs', name: 'Clubs & Activities', icon: Users },
  { id: 'placements', name: 'Placements', icon: Briefcase },
  { id: 'lost-found', name: 'Lost & Found', icon: Search },
]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get('category') || 'all'

  const handleCategoryChange = (categoryId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId === 'all') {
      params.delete('category')
    } else {
      params.set('category', categoryId)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sticky top-24">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Categories
      </h2>
      <div className="space-y-2">
        {categories.map((category) => {
          const Icon = category.icon
          const isActive = selectedCategory === category.id
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-vit-primary text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


