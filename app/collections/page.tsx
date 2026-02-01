import { Navbar } from '@/components/ui/Navbar'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { featured: true },
    include: {
      recipes: {
        include: {
          recipe: {
            include: {
              tags: true,
            },
          },
        },
        orderBy: { sortOrder: 'asc' },
        take: 3,
      },
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Recipe Collections</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 bg-gradient-to-br from-primary-400 to-primary-600">
                {collection.imageUrl ? (
                  <Image
                    src={collection.imageUrl}
                    alt={collection.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white text-6xl">
                    📚
                  </div>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{collection.title}</h2>
                <p className="text-gray-600 mb-4">{collection.description}</p>
                <p className="text-sm text-gray-500">
                  {collection.recipes.length} recipes
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
