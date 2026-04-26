import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/ui/Navbar'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const RECOMMENDED_RECIPES = [
  { id: 'r1', title: 'Mediterranean Quinoa Bowl', time: '25 min', cal: 420, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop' },
  { id: 'r2', title: 'Lemon Garlic Salmon', time: '20 min', cal: 390, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop' },
  { id: 'r3', title: 'Chicken Tikka Masala', time: '45 min', cal: 520, img: 'https://images.unsplash.com/photo-1540189549336-e6e99b50e87d?w=300&h=200&fit=crop' },
  { id: 'r4', title: 'Fluffy Pancakes', time: '20 min', cal: 350, img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop' },
]

const RECENTLY_SAVED = [
  { id: 's1', title: 'Margherita Pizza', time: '30 min', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&h=200&fit=crop' },
  { id: 's2', title: 'Street Tacos', time: '35 min', img: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop' },
  { id: 's3', title: 'Overnight Oats', time: '10 min', img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=300&h=200&fit=crop' },
]

const WEEK_DAYS = [
  { day: 'Mon', meals: 3 },
  { day: 'Tue', meals: 2 },
  { day: 'Wed', meals: 3 },
  { day: 'Thu', meals: 1 },
  { day: 'Fri', meals: 2 },
  { day: 'Sat', meals: 3 },
  { day: 'Sun', meals: 2 },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const profile = await prisma.userProfile.findUnique({
    where: { userId: session.user.id },
  })

  if (!profile) {
    redirect('/onboarding')
  }

  const recentPlans = await prisma.mealPlan.findMany({
    where: { userId: session.user.id },
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      mealSlots: {
        include: { recipe: true },
      },
    },
  })

  const likedRecipes = await prisma.recipePreference.count({
    where: { userId: session.user.id, liked: true },
  })

  const firstName = session.user.name?.split(' ')[0] ?? 'there'
  const greeting = getGreeting()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{greeting}, {firstName}! 👋</h1>
          <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { href: '/recipes/add', icon: '➕', label: 'Add Recipe', color: 'from-orange-400 to-primary-500' },
            { href: '/planner', icon: '🤖', label: 'Generate Plan', color: 'from-blue-400 to-blue-600' },
            { href: '/planner', icon: '🔄', label: 'Refresh Week', color: 'from-green-400 to-green-600' },
            { href: '/grocery-list', icon: '🛒', label: 'Build Grocery List', color: 'from-purple-400 to-purple-600' },
          ].map(action => (
            <Link key={action.label} href={action.href} className={`bg-gradient-to-br ${action.color} rounded-2xl p-5 text-white hover:shadow-lg transition-shadow group`}>
              <div className="text-3xl mb-2">{action.icon}</div>
              <p className="font-semibold text-sm group-hover:underline">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* This Week at a Glance */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">📅 This Week at a Glance</h2>
            <Link href="/planner" className="text-sm text-primary-500 hover:underline font-medium">Continue Planning →</Link>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {WEEK_DAYS.map(({ day, meals }) => (
              <div key={day} className="text-center">
                <p className="text-xs text-gray-400 mb-2 font-medium">{day}</p>
                <div className={`h-14 rounded-xl flex flex-col items-center justify-center text-sm font-semibold ${meals > 0 ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'}`}>
                  {meals > 0 ? <><span className="text-lg">{meals}</span><span className="text-xs">meals</span></> : <span>—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recommended For You */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">⭐ Recommended For You</h2>
              <Link href="/discover" className="text-sm text-primary-500 hover:underline">See all</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {RECOMMENDED_RECIPES.map(r => (
                <div key={r.id} className="min-w-[180px] bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-28 bg-gray-200 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-800 line-clamp-1">{r.title}</p>
                    <div className="flex gap-2 text-xs text-gray-400 mt-1">
                      <span>⏱️ {r.time}</span>
                      <span>🔥 {r.cal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-500 mb-1">💡 Weekly Insight</p>
              <p className="text-sm text-gray-700 mb-3">This week: <span className="font-semibold text-primary-600">65g avg protein</span> / goal 80g</p>
              <div className="h-2 bg-gray-100 rounded-full mb-3">
                <div className="h-2 bg-primary-500 rounded-full" style={{ width: '81%' }} />
              </div>
              <Link href="/insights" className="text-xs text-primary-500 hover:underline font-medium">View full insights →</Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-500 mb-2">📊 Stats</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-2 bg-primary-50 rounded-xl">
                  <p className="text-2xl font-bold text-primary-600">{likedRecipes}</p>
                  <p className="text-xs text-gray-500">Liked</p>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded-xl">
                  <p className="text-2xl font-bold text-blue-600">{recentPlans.length}</p>
                  <p className="text-xs text-gray-500">Plans</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Collection Banner */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-600 rounded-2xl p-6 mb-8 text-white">
          <p className="text-sm font-semibold uppercase tracking-wide mb-1">Featured Collection</p>
          <h2 className="text-2xl font-bold mb-2">🌿 Anti-Inflammatory Week</h2>
          <p className="text-green-100 mb-4">7 curated recipes rich in omega-3s and antioxidants</p>
          <Link href="/discover" className="inline-block bg-white text-green-700 font-semibold px-5 py-2 rounded-xl hover:bg-green-50 transition-colors">Explore Collection →</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Creator Spotlight */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-sm font-semibold text-gray-500 mb-3">👩‍🍳 Creator Spotlight</p>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-300 to-primary-500 rounded-full flex items-center justify-center text-white text-xl font-bold">M</div>
              <div>
                <h3 className="font-bold text-gray-800">Chef Maria Chen</h3>
                <p className="text-sm text-gray-500">Mediterranean &amp; Asian Fusion • 247 recipes</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-3">Specializing in nutrient-dense meals that never sacrifice flavor. James Beard nominee 2023.</p>
            <button className="mt-3 text-sm text-primary-500 hover:underline font-medium">Follow Chef Maria →</button>
          </div>

          {/* Recently Saved */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-gray-500">🔖 Recently Saved</p>
              <Link href="/my-recipes" className="text-xs text-primary-500 hover:underline">View all</Link>
            </div>
            <div className="space-y-3">
              {RECENTLY_SAVED.map(r => (
                <div key={r.id} className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-800">{r.title}</p>
                    <p className="text-xs text-gray-400">⏱️ {r.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
