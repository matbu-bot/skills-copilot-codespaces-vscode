import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { recipeSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    const recipes = await prisma.recipe.findMany({
      skip,
      take: limit,
      include: {
        tags: true,
        nutrition: true,
        ingredients: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const total = await prisma.recipe.count()

    return NextResponse.json({
      recipes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Get recipes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const validation = recipeSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    const { ingredients, steps, tags, ...recipeData } = validation.data

    const recipe = await prisma.recipe.create({
      data: {
        ...recipeData,
        userId: session.user.id,
        source: 'user-created',
        ingredients: {
          create: ingredients.map((ing, idx) => ({
            ...ing,
            sortOrder: idx,
          })),
        },
        steps: {
          create: steps,
        },
        tags: tags ? {
          create: tags,
        } : undefined,
      },
      include: {
        ingredients: true,
        steps: true,
        tags: true,
      },
    })

    return NextResponse.json(recipe, { status: 201 })
  } catch (error) {
    console.error('Create recipe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
