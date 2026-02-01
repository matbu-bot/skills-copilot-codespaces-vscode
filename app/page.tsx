import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export default async function Home() {
  const session = await getServerSession(authOptions)
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-500">LuMa</span>
          </h1>
          <p className="text-2xl text-gray-700 mb-4">
            Spotify for Recipes
          </p>
          <p className="text-xl text-gray-600 mb-12">
            Discover recipes you'll love, plan your weekly meals, and generate smart grocery lists
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/auth/signup"
              className="px-8 py-4 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/auth/signin"
              className="px-8 py-4 bg-white text-primary-500 rounded-lg font-semibold border-2 border-primary-500 hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-xl font-semibold mb-2">Discover Recipes</h3>
              <p className="text-gray-600">
                Swipe through personalized recipe recommendations tailored to your taste
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Plan Your Week</h3>
              <p className="text-gray-600">
                Generate weekly meal plans that match your schedule and preferences
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold mb-2">Smart Grocery Lists</h3>
              <p className="text-gray-600">
                Auto-generate organized grocery lists from your meal plan
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
