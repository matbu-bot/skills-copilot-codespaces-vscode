import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Navbar } from '@/components/ui/Navbar'
import { RecipeCard } from '@/components/recipes/RecipeCard'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function RecipesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const recipes = await prisma.recipe.findMany({
    take: 20,
    include: {
      tags: true,
      nutrition: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recipe Library</h1>
          <div className="flex gap-3">
            <Link
              href="/recipes/import"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Import from URL
            </Link>
            <Link
              href="/recipes/add"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Add Recipe
            </Link>
          </div>
        </div>

        {recipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No recipes yet. Add your first recipe!</p>
            <Link
              href="/recipes/add"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Add Recipe
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
