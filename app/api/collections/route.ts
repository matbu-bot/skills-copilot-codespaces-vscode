import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
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
      take: 10,
    })

    return NextResponse.json(collections)
  } catch (error) {
    console.error('Get collections error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
