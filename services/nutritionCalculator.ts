import { prisma } from '@/lib/prisma'

export interface WeeklyNutritionSummary {
  totalCalories: number
  avgCaloriesPerDay: number
  totalProtein: number
  totalFat: number
  totalCarbs: number
  avgProteinPerDay: number
  avgFatPerDay: number
  avgCarbsPerDay: number
  mealsCount: number
}

export async function calculateWeeklyNutrition(
  mealPlanId: string
): Promise<WeeklyNutritionSummary> {
  const mealSlots = await prisma.mealSlot.findMany({
    where: { mealPlanId },
    include: {
      recipe: {
        include: {
          nutrition: true,
        },
      },
    },
  })

  let totalCalories = 0
  let totalProtein = 0
  let totalFat = 0
  let totalCarbs = 0
  let mealsCount = 0

  for (const slot of mealSlots) {
    if (!slot.recipe?.nutrition) continue

    const nutrition = slot.recipe.nutrition
    const servingMultiplier = slot.servings / slot.recipe.servings

    if (nutrition.calories) {
      totalCalories += nutrition.calories * servingMultiplier
    }
    if (nutrition.protein) {
      totalProtein += nutrition.protein * servingMultiplier
    }
    if (nutrition.fat) {
      totalFat += nutrition.fat * servingMultiplier
    }
    if (nutrition.carbs) {
      totalCarbs += nutrition.carbs * servingMultiplier
    }

    mealsCount++
  }

  const daysWithMeals = mealsCount > 0 ? 7 : 1 // Assume 7 days

  return {
    totalCalories: Math.round(totalCalories),
    avgCaloriesPerDay: Math.round(totalCalories / daysWithMeals),
    totalProtein: Math.round(totalProtein),
    totalFat: Math.round(totalFat),
    totalCarbs: Math.round(totalCarbs),
    avgProteinPerDay: Math.round(totalProtein / daysWithMeals),
    avgFatPerDay: Math.round(totalFat / daysWithMeals),
    avgCarbsPerDay: Math.round(totalCarbs / daysWithMeals),
    mealsCount,
  }
}

export function calculateMacroPercentages(nutrition: WeeklyNutritionSummary) {
  const totalMacros = nutrition.totalProtein + nutrition.totalFat + nutrition.totalCarbs

  if (totalMacros === 0) {
    return { protein: 0, fat: 0, carbs: 0 }
  }

  return {
    protein: Math.round((nutrition.totalProtein / totalMacros) * 100),
    fat: Math.round((nutrition.totalFat / totalMacros) * 100),
    carbs: Math.round((nutrition.totalCarbs / totalMacros) * 100),
  }
}
