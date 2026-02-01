'use client'

import Image from 'next/image'
import Link from 'next/link'
import { formatTime } from '@/utils/helpers'

interface Recipe {
  id: string
  title: string
  description?: string | null
  totalTime: number
  servings: number
  imageUrl?: string | null
  tags?: Array<{
    tagType: string
    tagValue: string
  }>
  nutrition?: {
    calories?: number | null
  } | null
}

interface RecipeCardProps {
  recipe: Recipe
  onClick?: () => void
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
  const cuisineTags = recipe.tags?.filter(t => t.tagType === 'cuisine') || []
  const dietaryTags = recipe.tags?.filter(t => t.tagType === 'dietary') || []

  const content = (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="relative h-48 bg-gray-200">
        {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <span className="text-6xl">🍽️</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
        )}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span>⏱️ {formatTime(recipe.totalTime)}</span>
          <span>👥 {recipe.servings} servings</span>
          {recipe.nutrition?.calories && (
            <span>🔥 {recipe.nutrition.calories} cal</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {cuisineTags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full"
            >
              {tag.tagValue}
            </span>
          ))}
          {dietaryTags.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
            >
              {tag.tagValue}
            </span>
          ))}
        </div>
      </div>
    </div>
  )

  if (onClick) {
    return <div onClick={onClick}>{content}</div>
  }

  return <Link href={`/recipes/${recipe.id}`}>{content}</Link>
}
