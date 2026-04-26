import { Navbar } from '@/components/ui/Navbar'
import Link from 'next/link'

export default function GroceryListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Your Grocery List</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Build your grocery list from your weekly meal plan. Once you generate a plan, your ingredients will appear here automatically.
        </p>

        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <p className="text-lg text-gray-600 mb-6">No grocery list yet for this week.</p>
          <Link
            href="/planner"
            className="inline-block px-8 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors"
          >
            📅 Go to Planner
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '📅', title: 'Plan Your Week', desc: 'Generate a personalized meal plan in seconds' },
            { icon: '🛒', title: 'Auto-Build List', desc: 'Ingredients compile automatically from your meals' },
            { icon: '✅', title: 'Shop with Ease', desc: 'Check off items as you shop' },
          ].map(step => (
            <div key={step.title} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-3xl mb-2">{step.icon}</div>
              <h3 className="font-semibold text-gray-800 mb-1">{step.title}</h3>
              <p className="text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
