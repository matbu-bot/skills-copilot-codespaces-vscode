import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mealPlan = await prisma.mealPlan.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        mealSlots: {
          include: {
            recipe: {
              include: {
                tags: true,
                nutrition: true,
              },
            },
          },
          orderBy: [
            { dayOfWeek: 'asc' },
            { mealType: 'asc' },
          ],
        },
      },
    })

    if (!mealPlan) {
      return NextResponse.json({ error: 'Meal plan not found' }, { status: 404 })
    }

    return NextResponse.json(mealPlan)
  } catch (error) {
    console.error('Get meal plan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
