'use client'

interface CategoryBadgeProps {
  category: string
}

const categoryColors: Record<string, string> = {
  news: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  'campus-updates': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  academics: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  events: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  confessions: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  clubs: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  placements: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'lost-found': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  general: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClass = categoryColors[category] || categoryColors.general
  const displayName = category.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
      {displayName}
    </span>
  )
}


