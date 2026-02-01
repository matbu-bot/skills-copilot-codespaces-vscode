import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { importRecipeFromUrl } from '@/services/recipeImporter'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await req.json()

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    const importedRecipe = await importRecipeFromUrl(url)

    return NextResponse.json(importedRecipe)
  } catch (error) {
    console.error('Import recipe error:', error)
    return NextResponse.json(
      { error: 'Failed to import recipe' },
      { status: 500 }
    )
  }
}
