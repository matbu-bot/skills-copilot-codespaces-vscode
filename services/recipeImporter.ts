export interface RecipeImportResult {
  title: string
  description?: string
  prepTime?: number
  totalTime: number
  servings: number
  imageUrl?: string
  ingredients: Array<{
    name: string
    quantity?: number
    unit?: string
    notes?: string
  }>
  steps: Array<{
    stepNumber: number
    instruction: string
  }>
  tags?: Array<{
    tagType: string
    tagValue: string
  }>
}

/**
 * Stub service for importing recipes from URLs
 * In production, this would use a web scraper or recipe parser API
 * to extract structured data from recipe websites
 */
export async function importRecipeFromUrl(url: string): Promise<RecipeImportResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // TODO: Integrate with recipe parser service (e.g., Recipe Scrapers, Edamam)
  // For now, return mock data based on URL
  
  const mockRecipes: Record<string, RecipeImportResult> = {
    'allrecipes.com': {
      title: 'Spaghetti Carbonara',
      description: 'Classic Italian pasta dish with eggs, cheese, and pancetta',
      prepTime: 10,
      totalTime: 25,
      servings: 4,
      imageUrl: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
      ingredients: [
        { name: 'Spaghetti', quantity: 1, unit: 'lb' },
        { name: 'Eggs', quantity: 4, unit: 'large' },
        { name: 'Parmesan cheese', quantity: 1, unit: 'cup' },
        { name: 'Pancetta', quantity: 6, unit: 'oz' },
        { name: 'Black pepper', quantity: 1, unit: 'tsp' },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Cook spaghetti according to package directions.' },
        { stepNumber: 2, instruction: 'Fry pancetta until crispy.' },
        { stepNumber: 3, instruction: 'Whisk eggs with parmesan and black pepper.' },
        { stepNumber: 4, instruction: 'Drain pasta, reserving 1 cup pasta water.' },
        { stepNumber: 5, instruction: 'Toss hot pasta with pancetta, then remove from heat.' },
        { stepNumber: 6, instruction: 'Quickly stir in egg mixture, adding pasta water to create sauce.' },
      ],
      tags: [
        { tagType: 'cuisine', tagValue: 'italian' },
        { tagType: 'mealType', tagValue: 'dinner' },
      ],
    },
  }

  // Return mock recipe or generate generic one
  return mockRecipes['allrecipes.com'] || {
    title: 'Imported Recipe from ' + new URL(url).hostname,
    description: 'Recipe imported from web',
    totalTime: 30,
    servings: 4,
    ingredients: [
      { name: 'Ingredient 1', quantity: 1, unit: 'cup' },
      { name: 'Ingredient 2', quantity: 2, unit: 'tbsp' },
    ],
    steps: [
      { stepNumber: 1, instruction: 'Prepare ingredients.' },
      { stepNumber: 2, instruction: 'Cook according to recipe.' },
    ],
  }
}
