import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { regenerateMealSlot } from '@/services/mealPlanGenerator'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { slotId } = await req.json()
    const { id } = await params

    if (!slotId) {
      return NextResponse.json(
        { error: 'Slot ID is required' },
        { status: 400 }
      )
    }

    const newRecipeId = await regenerateMealSlot(id, slotId)

    const updatedSlot = await prisma.mealSlot.update({
      where: { id: slotId },
      data: { recipeId: newRecipeId },
      include: {
        recipe: {
          include: {
            tags: true,
          },
        },
      },
    })

    return NextResponse.json(updatedSlot)
  } catch (error: any) {
    console.error('Regenerate slot error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
