import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/ui/Navbar'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

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
        include: {
          recipe: true,
        },
      },
    },
  })

  const likedRecipes = await prisma.recipePreference.count({
    where: {
      userId: session.user.id,
      liked: true,
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome back! 👋</h1>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Liked Recipes</h3>
            <p className="text-4xl font-bold text-primary-500">{likedRecipes}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Meal Plans</h3>
            <p className="text-4xl font-bold text-primary-500">{recentPlans.length}</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">Dietary Pattern</h3>
            <p className="text-lg text-gray-700">
              {profile.dietaryPatterns[0] || 'None set'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                href="/recipes/feed"
                className="block bg-primary-500 text-white p-4 rounded-lg hover:bg-primary-600 transition-colors"
              >
                🔥 Discover New Recipes
              </Link>
              <Link
                href="/planner"
                className="block bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-colors"
              >
                📅 Create Meal Plan
              </Link>
              <Link
                href="/recipes/add"
                className="block bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors"
              >
                ➕ Add Recipe
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Recent Meal Plans</h2>
            {recentPlans.length > 0 ? (
              <div className="space-y-3">
                {recentPlans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/planner?planId=${plan.id}`}
                    className="block bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <p className="font-semibold">{plan.name || 'Untitled Plan'}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(plan.weekStartDate).toLocaleDateString()} • {plan.mealSlots.length} meals
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                No meal plans yet. Create your first one!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
