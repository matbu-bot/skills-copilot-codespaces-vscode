import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const { searchParams } = new URL(req.url)
    
    const query = searchParams.get('q') || ''
    const cuisine = searchParams.get('cuisine')
    const dietary = searchParams.get('dietary')
    const maxTime = searchParams.get('maxTime')
    
    const where: any = {}

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ]
    }

    if (cuisine || dietary) {
      where.tags = {
        some: {
          OR: [
            cuisine ? { tagType: 'cuisine', tagValue: cuisine } : {},
            dietary ? { tagType: 'dietary', tagValue: dietary } : {},
          ].filter(obj => Object.keys(obj).length > 0),
        },
      }
    }

    if (maxTime) {
      where.totalTime = { lte: parseInt(maxTime) }
    }

    const recipes = await prisma.recipe.findMany({
      where,
      include: {
        tags: true,
        nutrition: true,
      },
      take: 50,
    })

    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Search recipes error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
