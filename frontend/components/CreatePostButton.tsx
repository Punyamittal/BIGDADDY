'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { CreatePostModal } from './CreatePostModal'

export function CreatePostButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-vit-primary text-white rounded-lg hover:bg-vit-primary/90 transition-colors shadow-sm"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">New Post</span>
      </button>
      <CreatePostModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}


