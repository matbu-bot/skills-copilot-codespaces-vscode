'use client'

import { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'

const MOCK_RECIPES = [
  { id: '1', title: 'Fresh Garden Salad', description: 'Crisp greens with house vinaigrette', totalTime: 15, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'Mediterranean' }, { tagType: 'dietary', tagValue: 'Vegan' }], nutrition: { calories: 180 } },
  { id: '2', title: 'Margherita Pizza', description: 'Classic wood-fired pizza with fresh basil', totalTime: 30, servings: 4, imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'Italian' }], nutrition: { calories: 420 } },
  { id: '3', title: 'Spaghetti Carbonara', description: 'Creamy pasta with guanciale and pecorino', totalTime: 25, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'Italian' }], nutrition: { calories: 610 } },
  { id: '4', title: 'Pan-Seared Salmon', description: 'Atlantic salmon with lemon herb butter', totalTime: 20, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop', tags: [{ tagType: 'dietary', tagValue: 'GF' }], nutrition: { calories: 390 } },
  { id: '5', title: 'Ribeye Steak', description: 'Perfectly grilled with garlic butter', totalTime: 25, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', tags: [{ tagType: 'dietary', tagValue: 'GF' }], nutrition: { calories: 680 } },
  { id: '6', title: 'Fluffy Pancakes', description: 'Buttermilk stacks with maple syrup', totalTime: 20, servings: 4, imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'American' }], nutrition: { calories: 350 } },
  { id: '7', title: 'Street Tacos', description: 'Authentic carne asada with salsa verde', totalTime: 35, servings: 3, imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'Mexican' }], nutrition: { calories: 420 } },
  { id: '8', title: 'Sushi Platter', description: 'Assorted nigiri and maki rolls', totalTime: 60, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'Asian' }], nutrition: { calories: 480 } },
  { id: '9', title: 'Lentil Soup', description: 'Hearty red lentil soup with cumin', totalTime: 40, servings: 6, imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop', tags: [{ tagType: 'dietary', tagValue: 'Vegan' }, { tagType: 'cuisine', tagValue: 'Mediterranean' }], nutrition: { calories: 240 } },
  { id: '10', title: 'Smash Burger', description: 'Double smash patty with secret sauce', totalTime: 20, servings: 2, imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'American' }], nutrition: { calories: 750 } },
  { id: '11', title: 'Chicken Curry', description: 'Aromatic coconut curry with jasmine rice', totalTime: 45, servings: 4, imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99b50e87d?w=400&h=300&fit=crop', tags: [{ tagType: 'cuisine', tagValue: 'Indian' }], nutrition: { calories: 520 } },
  { id: '12', title: 'Overnight Oats', description: 'Creamy oats with berries and honey', totalTime: 10, servings: 1, imageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&h=300&fit=crop', tags: [{ tagType: 'dietary', tagValue: 'Vegetarian' }], nutrition: { calories: 310 } },
]

const CUISINE_FILTERS = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'Thai', 'French', 'American']
const DIETARY_FILTERS = ['Vegetarian', 'Vegan', 'GF', 'Dairy-Free']
const TIME_FILTERS = ['Under 20min', '20-30min', '30-45min', '45min+']
const MEAL_FILTERS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'swipe'>('browse')
  const [search, setSearch] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [swipeIndex, setSwipeIndex] = useState(0)
  const [swipeHistory, setSwipeHistory] = useState<Array<{ id: string; liked: boolean }>>([])

  const toggleFilter = (f: string) => {
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f])
  }

  const filteredRecipes = MOCK_RECIPES.filter(r =>
    search === '' || r.title.toLowerCase().includes(search.toLowerCase()) || r.description.toLowerCase().includes(search.toLowerCase())
  )

  const currentSwipeRecipe = MOCK_RECIPES[swipeIndex % MOCK_RECIPES.length]

  const handleSwipe = (liked: boolean) => {
    setSwipeHistory(prev => [...prev, { id: currentSwipeRecipe.id, liked }])
    setSwipeIndex(prev => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero search */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 py-12 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Discover Something Delicious</h1>
          <p className="text-primary-100 mb-6">Find your next favorite recipe</p>
          <div className="relative">
            <input
              type="text"
              placeholder="Search recipes, cuisines, chefs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl text-gray-800 text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-300"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filter chips */}
        <div className="space-y-3 mb-6">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Cuisine</span>
            {CUISINE_FILTERS.map(f => (
              <button key={f} onClick={() => toggleFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilters.includes(f) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>{f}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Dietary</span>
            {DIETARY_FILTERS.map(f => (
              <button key={f} onClick={() => toggleFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilters.includes(f) ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>{f}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Prep Time</span>
            {TIME_FILTERS.map(f => (
              <button key={f} onClick={() => toggleFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilters.includes(f) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}>{f}</button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Meal Type</span>
            {MEAL_FILTERS.map(f => (
              <button key={f} onClick={() => toggleFilter(f)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${activeFilters.includes(f) ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-400'}`}>{f}</button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit mb-8">
          <button onClick={() => setActiveTab('browse')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'browse' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 hover:text-gray-700'}`}>Browse</button>
          <button onClick={() => setActiveTab('swipe')} className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'swipe' ? 'bg-white text-gray-800 shadow' : 'text-gray-500 hover:text-gray-700'}`}>Swipe Mode</button>
        </div>

        {activeTab === 'browse' && (
          <div>
            {/* Editorial banner */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl p-6 mb-8 text-white">
              <p className="text-sm font-semibold uppercase tracking-wide mb-1">Featured Collection</p>
              <h2 className="text-2xl font-bold mb-2">🌿 Anti-Inflammatory Week</h2>
              <p className="text-orange-100 mb-4">Curated recipes packed with omega-3s, antioxidants, and whole foods</p>
              <button className="bg-white text-orange-600 font-semibold px-5 py-2 rounded-xl hover:bg-orange-50 transition-colors">Explore Collection →</button>
            </div>

            {/* Trending */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🔥 Trending This Week</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRecipes.slice(0, 4).map(recipe => (
                  <RecipeCardSimple key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>

            {/* Seasonal */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">🍂 Seasonal Favorites</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRecipes.slice(4, 8).map(recipe => (
                  <RecipeCardSimple key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>

            {/* Recommended */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">⭐ Recommended For You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredRecipes.slice(8, 12).map(recipe => (
                  <RecipeCardSimple key={recipe.id} recipe={recipe} />
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'swipe' && (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-6 italic">✨ LuMa is learning your taste</p>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm w-full">
              <div className="relative h-64 bg-gray-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={currentSwipeRecipe.imageUrl} alt={currentSwipeRecipe.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold mb-1">{currentSwipeRecipe.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{currentSwipeRecipe.description}</p>
                <div className="flex gap-3 text-sm text-gray-500 mb-4">
                  <span>⏱️ {currentSwipeRecipe.totalTime}min</span>
                  <span>👥 {currentSwipeRecipe.servings}</span>
                  <span>🔥 {currentSwipeRecipe.nutrition?.calories} cal</span>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => handleSwipe(false)} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-colors text-lg">👎 Pass</button>
                  <button onClick={() => handleSwipe(true)} className="flex-1 py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors text-lg">❤️ Like</button>
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3 text-sm text-gray-500">
              <span>✅ {swipeHistory.filter(h => h.liked).length} liked</span>
              <span>⏭️ {swipeHistory.filter(h => !h.liked).length} passed</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RecipeCardSimple({ recipe }: { recipe: typeof MOCK_RECIPES[0] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer group">
      <div className="relative h-44 bg-gray-200 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{recipe.title}</h3>
        <p className="text-xs text-gray-500 mb-2 line-clamp-1">{recipe.description}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>⏱️ {recipe.totalTime}min</span>
          <span>🔥 {recipe.nutrition?.calories} cal</span>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.slice(0, 2).map((t, i) => (
            <span key={i} className="px-2 py-0.5 rounded-full text-xs bg-primary-100 text-primary-700">{t.tagValue}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
