import { prisma } from '@/lib/prisma'

interface MealPlanPreferences {
  userId: string
  weekStartDate: Date
  mealsPerDay?: number
  avoidRecipeIds?: string[]
  preferredCuisines?: string[]
  maxPrepTime?: number
}

export async function generateMealPlan(preferences: MealPlanPreferences) {
  const { userId, weekStartDate, mealsPerDay = 1, avoidRecipeIds = [] } = preferences

  // Get user profile for dietary preferences
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  })

  // Get user's liked recipes
  const likedPreferences = await prisma.recipePreference.findMany({
    where: {
      userId,
      liked: true,
    },
    select: { recipeId: true },
  })

  const likedRecipeIds = likedPreferences.map((p) => p.recipeId)

  // Build recipe query based on preferences
  const where: any = {
    id: { notIn: avoidRecipeIds },
  }

  // Filter by dietary patterns if set
  if (profile?.dietaryPatterns && profile.dietaryPatterns.length > 0) {
    where.tags = {
      some: {
        tagType: 'dietary',
        tagValue: { in: profile.dietaryPatterns },
      },
    }
  }

  // Filter by time if set
  if (preferences.maxPrepTime || profile?.timeToCook) {
    where.totalTime = {
      lte: preferences.maxPrepTime || profile?.timeToCook,
    }
  }

  // Get candidate recipes
  let recipes = await prisma.recipe.findMany({
    where,
    include: {
      tags: true,
      nutrition: true,
    },
  })

  // Prioritize liked recipes
  recipes.sort((a, b) => {
    const aLiked = likedRecipeIds.includes(a.id) ? 1 : 0
    const bLiked = likedRecipeIds.includes(b.id) ? 1 : 0
    return bLiked - aLiked
  })

  // Generate meal slots for the week
  const mealSlots = []
  const mealTypes = ['breakfast', 'lunch', 'dinner']
  const usedRecipeIds = new Set<string>()

  if (recipes.length === 0) {
    throw new Error('No recipes available matching your dietary preferences. Please add more recipes or adjust your preferences.')
  }

  if (recipes.length < 7) {
    console.warn(`Only ${recipes.length} recipes available for meal planning. Some days may have duplicate recipes.`)
  }

  for (let day = 0; day < 7; day++) {
    // Only plan dinner by default (can be customized)
    const recipe = recipes.find(
      (r) => !usedRecipeIds.has(r.id)
    ) || recipes[day % recipes.length] // Fallback to cycling through recipes

    if (recipe) {
      mealSlots.push({
        dayOfWeek: day,
        mealType: 'dinner',
        recipeId: recipe.id,
        servings: profile?.householdSize || 4,
        locked: false,
      })
      usedRecipeIds.add(recipe.id)
    }
  }

  return mealSlots
}

export async function regenerateMealSlot(
  mealPlanId: string,
  slotId: string,
  avoidRecipeIds: string[] = []
) {
  const slot = await prisma.mealSlot.findUnique({
    where: { id: slotId },
    include: { mealPlan: true },
  })

  if (!slot || slot.locked) {
    throw new Error('Cannot regenerate locked or non-existent slot')
  }

  // Get all recipes in current plan to avoid repeats
  const currentSlots = await prisma.mealSlot.findMany({
    where: { mealPlanId },
    select: { recipeId: true },
  })

  const usedRecipeIds = currentSlots
    .map((s) => s.recipeId)
    .filter((id): id is string => id !== null)

  // Get user profile
  const profile = await prisma.userProfile.findUnique({
    where: { userId: slot.mealPlan.userId },
  })

  // Find alternative recipe
  const where: any = {
    id: { notIn: [...usedRecipeIds, ...avoidRecipeIds] },
  }

  if (profile?.dietaryPatterns && profile.dietaryPatterns.length > 0) {
    where.tags = {
      some: {
        tagType: 'dietary',
        tagValue: { in: profile.dietaryPatterns },
      },
    }
  }

  const alternativeRecipes = await prisma.recipe.findMany({
    where,
    take: 5,
  })

  // Pick a random recipe
  const newRecipe =
    alternativeRecipes[Math.floor(Math.random() * alternativeRecipes.length)]

  if (!newRecipe) {
    throw new Error('No alternative recipes found')
  }

  return newRecipe.id
}
