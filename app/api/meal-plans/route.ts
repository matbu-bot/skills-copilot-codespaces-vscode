import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateMealPlan } from '@/services/mealPlanGenerator'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mealPlans = await prisma.mealPlan.findMany({
      where: { userId: session.user.id },
      include: {
        mealSlots: {
          include: {
            recipe: {
              include: {
                tags: true,
              },
            },
          },
        },
      },
      orderBy: { weekStartDate: 'desc' },
      take: 10,
    })

    return NextResponse.json(mealPlans)
  } catch (error) {
    console.error('Get meal plans error:', error)
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

    const { weekStartDate, name } = await req.json()

    if (!weekStartDate) {
      return NextResponse.json(
        { error: 'Week start date is required' },
        { status: 400 }
      )
    }

    const mealSlots = await generateMealPlan({
      userId: session.user.id,
      weekStartDate: new Date(weekStartDate),
    })

    const mealPlan = await prisma.mealPlan.create({
      data: {
        userId: session.user.id,
        weekStartDate: new Date(weekStartDate),
        name,
        mealSlots: {
          create: mealSlots,
        },
      },
      include: {
        mealSlots: {
          include: {
            recipe: true,
          },
        },
      },
    })

    return NextResponse.json(mealPlan, { status: 201 })
  } catch (error) {
    console.error('Create meal plan error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
