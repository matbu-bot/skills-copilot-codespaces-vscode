'use client'

import { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'

const MOCK_RECIPES = [
  { id: '1', title: 'Fresh Garden Salad', description: 'Crisp greens with house vinaigrette', totalTime: 15, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', tags: ['Favorites', 'Weeknight', '20-Minute'], cuisine: 'Mediterranean', calories: 180 },
  { id: '2', title: 'Margherita Pizza', description: 'Classic wood-fired pizza with fresh basil', totalTime: 30, servings: 4, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', tags: ['Family Hit', 'Hosting'], cuisine: 'Italian', calories: 420 },
  { id: '3', title: 'Spaghetti Carbonara', description: 'Creamy pasta with guanciale and pecorino', totalTime: 25, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', tags: ['Weeknight', 'Family Hit'], cuisine: 'Italian', calories: 610 },
  { id: '4', title: 'Pan-Seared Salmon', description: 'Atlantic salmon with lemon herb butter', totalTime: 20, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', tags: ['High Protein', 'Favorites', '20-Minute'], cuisine: 'Mediterranean', calories: 390 },
  { id: '5', title: 'Ribeye Steak', description: 'Perfectly grilled with garlic butter', totalTime: 25, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', tags: ['High Protein', 'Hosting'], cuisine: 'American', calories: 680 },
  { id: '6', title: 'Fluffy Pancakes', description: 'Buttermilk stacks with maple syrup', totalTime: 20, servings: 4, imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', tags: ['Family Hit', 'Weeknight', '20-Minute'], cuisine: 'American', calories: 350 },
  { id: '7', title: 'Street Tacos', description: 'Authentic carne asada with salsa verde', totalTime: 35, servings: 3, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', tags: ['Weeknight', 'Family Hit'], cuisine: 'Mexican', calories: 420 },
  { id: '8', title: 'Lentil Soup', description: 'Hearty red lentil soup with cumin', totalTime: 40, servings: 6, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop', tags: ['Low-FODMAP', 'Meal Prep'], cuisine: 'Mediterranean', calories: 240 },
  { id: '9', title: 'Overnight Oats', description: 'Creamy oats with berries and honey', totalTime: 10, servings: 1, imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', tags: ['Meal Prep', '20-Minute', 'Recently Added'], cuisine: 'American', calories: 310 },
]

const LABEL_FILTERS = ['All', 'Favorites', 'Weeknight', 'Family Hit', 'High Protein', 'Hosting', '20-Minute', 'Low-FODMAP', 'Recently Added']
const SORT_OPTIONS = ['Newest', 'Oldest', 'A-Z', 'Quick (under 30min)', 'High Protein']

const COLLECTIONS = [
  { name: 'Weeknight Faves', emoji: '🌙', count: 12 },
  { name: 'Holiday Hosting', emoji: '🎄', count: 8 },
  { name: 'Meal Prep Sundays', emoji: '📦', count: 15 },
]

export default function MyRecipesPage() {
  const [search, setSearch] = useState('')
  const [activeLabel, setActiveLabel] = useState('All')
  const [sort, setSort] = useState('Newest')

  const filtered = MOCK_RECIPES.filter(r => {
    const matchesSearch = search === '' || r.title.toLowerCase().includes(search.toLowerCase())
    const matchesLabel = activeLabel === 'All' || r.tags.includes(activeLabel)
    return matchesSearch && matchesLabel
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'A-Z') return a.title.localeCompare(b.title)
    if (sort === 'Quick (under 30min)') return a.totalTime - b.totalTime
    if (sort === 'High Protein') return b.calories - a.calories
    return 0
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Recipes</h1>
            <p className="text-gray-500 mt-1">{MOCK_RECIPES.length} recipes in your library</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">➕ Add Recipe</button>
            <button className="px-4 py-2 border border-gray-200 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">🔗 Import URL</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">📚 Collections</h3>
              <div className="space-y-2">
                {COLLECTIONS.map(c => (
                  <div key={c.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group">
                    <div className="flex items-center gap-2">
                      <span>{c.emoji}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600">{c.name}</span>
                    </div>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{c.count}</span>
                  </div>
                ))}
                <button className="w-full text-left p-2 text-sm text-primary-500 hover:text-primary-600 font-medium">+ New Collection</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map(opt => (
                  <button key={opt} onClick={() => setSort(opt)} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sort === opt ? 'bg-primary-100 text-primary-700 font-semibold' : 'text-gray-600 hover:bg-gray-50'}`}>{opt}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Main */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search my recipes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>

            {/* Label chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {LABEL_FILTERS.map(label => (
                <button key={label} onClick={() => setActiveLabel(label)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeLabel === label ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>{label}</button>
              ))}
            </div>

            {/* Grid */}
            {sorted.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sorted.map(recipe => (
                  <div key={recipe.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group">
                    <div className="relative h-44 bg-gray-200 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{recipe.title}</h3>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{recipe.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                        <span>⏱️ {recipe.totalTime}min</span>
                        <span>👥 {recipe.servings}</span>
                        <span>🔥 {recipe.calories} cal</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {recipe.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-primary-100 text-primary-700">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <div className="text-5xl mb-4">🍽️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No recipes found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your search or filters</p>
                <button className="px-6 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">Browse Discover</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
