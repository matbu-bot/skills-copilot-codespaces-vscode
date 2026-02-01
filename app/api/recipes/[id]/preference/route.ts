import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { liked } = await req.json()
    const { id } = await params

    if (typeof liked !== 'boolean') {
      return NextResponse.json({ error: 'Invalid liked value' }, { status: 400 })
    }

    const preference = await prisma.recipePreference.upsert({
      where: {
        userId_recipeId: {
          userId: session.user.id,
          recipeId: id,
        },
      },
      update: { liked },
      create: {
        userId: session.user.id,
        recipeId: id,
        liked,
      },
    })

    return NextResponse.json(preference)
  } catch (error) {
    console.error('Set preference error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
