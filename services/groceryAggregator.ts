import { prisma } from '@/lib/prisma'

interface AggregatedIngredient {
  name: string
  quantity: number
  unit: string
  category: string
}

const CATEGORY_MAP: Record<string, string> = {
  // Produce
  'tomato': 'produce',
  'lettuce': 'produce',
  'onion': 'produce',
  'garlic': 'produce',
  'basil': 'produce',
  'cucumber': 'produce',
  'pepper': 'produce',
  'spinach': 'produce',
  'cauliflower': 'produce',
  'potato': 'produce',
  
  // Dairy
  'milk': 'dairy',
  'cheese': 'dairy',
  'butter': 'dairy',
  'yogurt': 'dairy',
  'cream': 'dairy',
  'mozzarella': 'dairy',
  'feta': 'dairy',
  'parmesan': 'dairy',
  
  // Meat
  'chicken': 'meat',
  'beef': 'meat',
  'pork': 'meat',
  'fish': 'meat',
  'salmon': 'meat',
  'pancetta': 'meat',
  
  // Pantry
  'flour': 'pantry',
  'sugar': 'pantry',
  'salt': 'pantry',
  'pepper': 'pantry',
  'oil': 'pantry',
  'pasta': 'pantry',
  'rice': 'pantry',
  'sauce': 'pantry',
  'vinegar': 'pantry',
  'soy sauce': 'pantry',
  
  // Protein alternatives
  'tofu': 'protein',
  'chickpeas': 'protein',
  'beans': 'protein',
  'lentils': 'protein',
  'eggs': 'protein',
}

function categorizeIngredient(name: string): string {
  const lowerName = name.toLowerCase()
  
  for (const [key, category] of Object.entries(CATEGORY_MAP)) {
    if (lowerName.includes(key)) {
      return category
    }
  }
  
  return 'other'
}

function normalizeUnit(unit: string | null): string {
  if (!unit) return 'unit'
  
  const unitMap: Record<string, string> = {
    'tablespoon': 'tbsp',
    'tablespoons': 'tbsp',
    'teaspoon': 'tsp',
    'teaspoons': 'tsp',
    'ounce': 'oz',
    'ounces': 'oz',
    'pound': 'lb',
    'pounds': 'lb',
    'can': 'can',
    'cans': 'can',
  }
  
  return unitMap[unit.toLowerCase()] || unit
}

export async function generateGroceryList(mealPlanId: string) {
  // Get all meal slots with recipes
  const mealSlots = await prisma.mealSlot.findMany({
    where: { mealPlanId },
    include: {
      recipe: {
        include: {
          ingredients: true,
        },
      },
    },
  })

  // Aggregate ingredients
  const ingredientMap = new Map<string, AggregatedIngredient>()

  for (const slot of mealSlots) {
    if (!slot.recipe) continue

    const servingMultiplier = slot.servings / slot.recipe.servings

    for (const ingredient of slot.recipe.ingredients) {
      const normalizedUnit = normalizeUnit(ingredient.unit)
      const key = `${ingredient.name.toLowerCase()}-${normalizedUnit}`
      
      const existing = ingredientMap.get(key)
      const quantity = (ingredient.quantity || 1) * servingMultiplier

      if (existing) {
        existing.quantity += quantity
      } else {
        ingredientMap.set(key, {
          name: ingredient.name,
          quantity,
          unit: normalizedUnit,
          category: categorizeIngredient(ingredient.name),
        })
      }
    }
  }

  // Convert to array and sort by category
  const items = Array.from(ingredientMap.values()).sort((a, b) => {
    if (a.category !== b.category) {
      return a.category.localeCompare(b.category)
    }
    return a.name.localeCompare(b.name)
  })

  // Create or update grocery list
  const existingList = await prisma.groceryList.findUnique({
    where: { mealPlanId },
  })

  if (existingList) {
    // Delete old items
    await prisma.groceryItem.deleteMany({
      where: { groceryListId: existingList.id },
    })

    // Create new items
    await prisma.groceryItem.createMany({
      data: items.map((item, index) => ({
        groceryListId: existingList.id,
        ...item,
        sortOrder: index,
      })),
    })

    return existingList.id
  } else {
    // Create new grocery list with items
    const newList = await prisma.groceryList.create({
      data: {
        mealPlanId,
        items: {
          create: items.map((item, index) => ({
            ...item,
            sortOrder: index,
          })),
        },
      },
    })

    return newList.id
  }
}
