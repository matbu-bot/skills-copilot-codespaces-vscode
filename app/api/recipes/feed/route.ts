import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId: session.user.id },
    })

    const dislikedRecipes = await prisma.recipePreference.findMany({
      where: {
        userId: session.user.id,
        liked: false,
      },
      select: { recipeId: true },
    })

    const dislikedIds = dislikedRecipes.map((p) => p.recipeId)

    const where: any = {
      id: { notIn: dislikedIds },
    }

    if (profile?.dietaryPatterns && profile.dietaryPatterns.length > 0) {
      where.tags = {
        some: {
          tagType: 'dietary',
          tagValue: { in: profile.dietaryPatterns },
        },
      }
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        tags: true,
        nutrition: true,
        ingredients: {
          take: 5,
        },
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Get recipe feed error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
