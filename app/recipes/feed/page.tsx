'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Recipe {
  id: string
  title: string
  description?: string | null
  totalTime: number
  servings: number
  imageUrl?: string | null
  tags?: Array<{ tagType: string; tagValue: string }>
  nutrition?: { calories?: number | null } | null
  ingredients?: Array<{ name: string }>
}

export default function RecipeFeedPage() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [likedCount, setLikedCount] = useState(0)

  useEffect(() => {
    fetchRecipes()
  }, [])

  const fetchRecipes = async () => {
    try {
      const response = await fetch('/api/recipes/feed')
      const data = await response.json()
      setRecipes(data)
    } catch (error) {
      console.error('Failed to fetch recipes:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePreference = async (liked: boolean) => {
    if (currentIndex >= recipes.length) return

    const recipe = recipes[currentIndex]

    try {
      await fetch(`/api/recipes/${recipe.id}/preference`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ liked }),
      })

      if (liked) {
        setLikedCount((prev) => prev + 1)
      }

      if (currentIndex === recipes.length - 1) {
        router.push('/planner')
      } else {
        setCurrentIndex((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Failed to save preference:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading recipes...</div>
        </div>
      </div>
    )
  }

  if (recipes.length === 0 || currentIndex >= recipes.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-xl mb-4">No more recipes to show!</p>
            <Button onClick={() => router.push('/planner')}>
              Create Meal Plan
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentRecipe = recipes[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">Discover Recipes 🔥</h1>
          <p className="text-gray-600">
            Swipe through recipes and like the ones you love
          </p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {recipes.length} • Liked: {likedCount}
            </span>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          <AnimatePresence mode="wait">
            {currentRecipe && (
              <motion.div
                key={currentRecipe.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="relative h-96">
                  {currentRecipe.imageUrl ? (
                    <Image
                      src={currentRecipe.imageUrl}
                      alt={currentRecipe.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gray-200">
                      <span className="text-9xl">🍽️</span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{currentRecipe.title}</h2>
                  {currentRecipe.description && (
                    <p className="text-gray-600 mb-4">{currentRecipe.description}</p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>⏱️ {currentRecipe.totalTime} min</span>
                    <span>👥 {currentRecipe.servings} servings</span>
                    {currentRecipe.nutrition?.calories && (
                      <span>🔥 {currentRecipe.nutrition.calories} cal</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentRecipe.tags?.slice(0, 4).map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                      >
                        {tag.tagValue}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      className="flex-1 text-lg"
                      onClick={() => handlePreference(false)}
                    >
                      👎 Pass
                    </Button>
                    <Button
                      className="flex-1 text-lg"
                      onClick={() => handlePreference(true)}
                    >
                      👍 Like
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {likedCount >= 3 && (
            <div className="mt-6 text-center">
              <Button
                variant="secondary"
                onClick={() => router.push('/planner')}
              >
                Done! Create My Meal Plan →
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
