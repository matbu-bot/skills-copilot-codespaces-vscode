import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateGroceryList } from '@/services/groceryAggregator'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mealPlanId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { mealPlanId } = await params
    let groceryList = await prisma.groceryList.findUnique({
      where: { mealPlanId },
      include: {
        items: {
          orderBy: [
            { category: 'asc' },
            { sortOrder: 'asc' },
          ],
        },
      },
    })

    if (!groceryList) {
      const listId = await generateGroceryList(mealPlanId)
      groceryList = await prisma.groceryList.findUnique({
        where: { id: listId },
        include: {
          items: {
            orderBy: [
              { category: 'asc' },
              { sortOrder: 'asc' },
            ],
          },
        },
      })
    }

    return NextResponse.json(groceryList)
  } catch (error) {
    console.error('Get grocery list error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ mealPlanId: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { itemId, checked, alreadyHave } = await req.json()

    if (!itemId) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 })
    }

    const updateData: any = {}
    if (typeof checked === 'boolean') updateData.checked = checked
    if (typeof alreadyHave === 'boolean') updateData.alreadyHave = alreadyHave

    const item = await prisma.groceryItem.update({
      where: { id: itemId },
      data: updateData,
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Update grocery item error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
