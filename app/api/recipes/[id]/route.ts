import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipe = await prisma.recipe.findUnique({
      where: { id: params.id },
      include: {
        ingredients: {
          orderBy: { sortOrder: 'asc' },
        },
        steps: {
          orderBy: { stepNumber: 'asc' },
        },
        tags: true,
        nutrition: true,
        user: {
          select: { email: true },
        },
      },
    })

    if (!recipe) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 })
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Get recipe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
