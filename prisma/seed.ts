import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Prevent seeding with weak credentials in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Cannot seed with demo credentials in production. Use proper user management.')
  }

  // Create test user (DEV ONLY - use stronger credentials in production)
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.upsert({
    where: { email: 'demo@luma.app' },
    update: {},
    create: {
      email: 'demo@luma.app',
      password: hashedPassword,
      profile: {
        create: {
          dietaryPatterns: ['vegetarian'],
          allergies: ['nuts'],
          dislikedIngredients: ['cilantro'],
          timeToCook: 30,
          cuisines: ['italian', 'mediterranean', 'asian'],
          healthGoals: ['balanced-diet'],
          householdSize: 2,
          weeklyCookingCadence: 5,
        },
      },
    },
  })

  // Sample recipes
  const recipes = [
    {
      title: 'Classic Margherita Pizza',
      description: 'A simple and delicious pizza with fresh mozzarella, tomatoes, and basil.',
      prepTime: 20,
      totalTime: 45,
      servings: 4,
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
      source: 'user-created',
      ingredients: [
        { name: 'Pizza dough', quantity: 1, unit: 'lb', sortOrder: 0 },
        { name: 'Tomato sauce', quantity: 1, unit: 'cup', sortOrder: 1 },
        { name: 'Fresh mozzarella', quantity: 8, unit: 'oz', sortOrder: 2 },
        { name: 'Fresh basil', quantity: 10, unit: 'leaves', sortOrder: 3 },
        { name: 'Olive oil', quantity: 2, unit: 'tbsp', sortOrder: 4 },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Preheat oven to 475°F (245°C).' },
        { stepNumber: 2, instruction: 'Roll out pizza dough on a floured surface.' },
        { stepNumber: 3, instruction: 'Spread tomato sauce evenly over dough.' },
        { stepNumber: 4, instruction: 'Top with fresh mozzarella and drizzle with olive oil.' },
        { stepNumber: 5, instruction: 'Bake for 12-15 minutes until crust is golden.' },
        { stepNumber: 6, instruction: 'Add fresh basil leaves and serve immediately.' },
      ],
      tags: [
        { tagType: 'cuisine', tagValue: 'italian' },
        { tagType: 'mealType', tagValue: 'dinner' },
        { tagType: 'dietary', tagValue: 'vegetarian' },
      ],
      nutrition: {
        calories: 285,
        protein: 12,
        fat: 10,
        carbs: 38,
        fiber: 2,
        perServing: true,
      },
    },
    {
      title: 'Mediterranean Chickpea Bowl',
      description: 'A healthy and flavorful bowl with chickpeas, vegetables, and tahini dressing.',
      prepTime: 15,
      totalTime: 30,
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      source: 'user-created',
      ingredients: [
        { name: 'Chickpeas', quantity: 1, unit: 'can (15oz)', sortOrder: 0 },
        { name: 'Cherry tomatoes', quantity: 1, unit: 'cup', sortOrder: 1 },
        { name: 'Cucumber', quantity: 1, unit: 'medium', sortOrder: 2 },
        { name: 'Red onion', quantity: 0.5, unit: 'small', sortOrder: 3 },
        { name: 'Feta cheese', quantity: 0.5, unit: 'cup', sortOrder: 4 },
        { name: 'Tahini', quantity: 3, unit: 'tbsp', sortOrder: 5 },
        { name: 'Lemon juice', quantity: 2, unit: 'tbsp', sortOrder: 6 },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Drain and rinse chickpeas.' },
        { stepNumber: 2, instruction: 'Chop vegetables into bite-sized pieces.' },
        { stepNumber: 3, instruction: 'Mix tahini with lemon juice and water to make dressing.' },
        { stepNumber: 4, instruction: 'Combine chickpeas and vegetables in bowls.' },
        { stepNumber: 5, instruction: 'Top with feta and drizzle with tahini dressing.' },
      ],
      tags: [
        { tagType: 'cuisine', tagValue: 'mediterranean' },
        { tagType: 'mealType', tagValue: 'lunch' },
        { tagType: 'dietary', tagValue: 'vegetarian' },
        { tagType: 'dietary', tagValue: 'gluten-free' },
      ],
      nutrition: {
        calories: 420,
        protein: 18,
        fat: 18,
        carbs: 52,
        fiber: 12,
        perServing: true,
      },
    },
    {
      title: 'Thai Basil Tofu Stir-Fry',
      description: 'Quick and flavorful stir-fry with crispy tofu and aromatic basil.',
      prepTime: 15,
      totalTime: 25,
      servings: 4,
      imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19',
      source: 'user-created',
      ingredients: [
        { name: 'Firm tofu', quantity: 14, unit: 'oz', sortOrder: 0 },
        { name: 'Thai basil', quantity: 1, unit: 'cup', sortOrder: 1 },
        { name: 'Bell peppers', quantity: 2, unit: 'medium', sortOrder: 2 },
        { name: 'Garlic', quantity: 4, unit: 'cloves', sortOrder: 3 },
        { name: 'Soy sauce', quantity: 3, unit: 'tbsp', sortOrder: 4 },
        { name: 'Brown sugar', quantity: 1, unit: 'tbsp', sortOrder: 5 },
        { name: 'Vegetable oil', quantity: 2, unit: 'tbsp', sortOrder: 6 },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Press tofu and cut into cubes.' },
        { stepNumber: 2, instruction: 'Heat oil in a wok or large skillet over high heat.' },
        { stepNumber: 3, instruction: 'Fry tofu until golden brown, about 5-7 minutes.' },
        { stepNumber: 4, instruction: 'Add garlic and bell peppers, stir-fry for 3 minutes.' },
        { stepNumber: 5, instruction: 'Add soy sauce and brown sugar, toss to coat.' },
        { stepNumber: 6, instruction: 'Add Thai basil and cook until wilted.' },
        { stepNumber: 7, instruction: 'Serve over rice.' },
      ],
      tags: [
        { tagType: 'cuisine', tagValue: 'asian' },
        { tagType: 'mealType', tagValue: 'dinner' },
        { tagType: 'dietary', tagValue: 'vegan' },
      ],
      nutrition: {
        calories: 245,
        protein: 15,
        fat: 12,
        carbs: 20,
        fiber: 3,
        perServing: true,
      },
    },
    {
      title: 'Caprese Salad',
      description: 'Fresh tomatoes, mozzarella, and basil drizzled with balsamic glaze.',
      prepTime: 10,
      totalTime: 10,
      servings: 2,
      imageUrl: 'https://images.unsplash.com/photo-1592417817038-d13bb4b50834',
      source: 'user-created',
      ingredients: [
        { name: 'Tomatoes', quantity: 3, unit: 'large', sortOrder: 0 },
        { name: 'Fresh mozzarella', quantity: 8, unit: 'oz', sortOrder: 1 },
        { name: 'Fresh basil', quantity: 1, unit: 'bunch', sortOrder: 2 },
        { name: 'Balsamic glaze', quantity: 2, unit: 'tbsp', sortOrder: 3 },
        { name: 'Olive oil', quantity: 2, unit: 'tbsp', sortOrder: 4 },
        { name: 'Salt and pepper', quantity: 1, unit: 'to taste', sortOrder: 5 },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Slice tomatoes and mozzarella into 1/4-inch rounds.' },
        { stepNumber: 2, instruction: 'Arrange alternating slices on a platter.' },
        { stepNumber: 3, instruction: 'Tuck basil leaves between slices.' },
        { stepNumber: 4, instruction: 'Drizzle with olive oil and balsamic glaze.' },
        { stepNumber: 5, instruction: 'Season with salt and pepper.' },
      ],
      tags: [
        { tagType: 'cuisine', tagValue: 'italian' },
        { tagType: 'mealType', tagValue: 'lunch' },
        { tagType: 'dietary', tagValue: 'vegetarian' },
        { tagType: 'occasion', tagValue: 'quick-meal' },
      ],
      nutrition: {
        calories: 310,
        protein: 14,
        fat: 22,
        carbs: 12,
        fiber: 2,
        perServing: true,
      },
    },
    {
      title: 'Vegetable Curry',
      description: 'Rich and creamy curry with mixed vegetables and coconut milk.',
      prepTime: 20,
      totalTime: 45,
      servings: 6,
      imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd',
      source: 'user-created',
      ingredients: [
        { name: 'Cauliflower', quantity: 1, unit: 'head', sortOrder: 0 },
        { name: 'Sweet potato', quantity: 2, unit: 'medium', sortOrder: 1 },
        { name: 'Chickpeas', quantity: 1, unit: 'can (15oz)', sortOrder: 2 },
        { name: 'Coconut milk', quantity: 1, unit: 'can (14oz)', sortOrder: 3 },
        { name: 'Curry paste', quantity: 3, unit: 'tbsp', sortOrder: 4 },
        { name: 'Onion', quantity: 1, unit: 'large', sortOrder: 5 },
        { name: 'Spinach', quantity: 2, unit: 'cups', sortOrder: 6 },
      ],
      steps: [
        { stepNumber: 1, instruction: 'Chop vegetables into bite-sized pieces.' },
        { stepNumber: 2, instruction: 'Sauté onion in a large pot until soft.' },
        { stepNumber: 3, instruction: 'Add curry paste and cook for 1 minute.' },
        { stepNumber: 4, instruction: 'Add sweet potato and cauliflower, cook for 5 minutes.' },
        { stepNumber: 5, instruction: 'Pour in coconut milk and simmer for 20 minutes.' },
        { stepNumber: 6, instruction: 'Add chickpeas and spinach, cook until wilted.' },
        { stepNumber: 7, instruction: 'Serve over rice.' },
      ],
      tags: [
        { tagType: 'cuisine', tagValue: 'indian' },
        { tagType: 'mealType', tagValue: 'dinner' },
        { tagType: 'dietary', tagValue: 'vegan' },
      ],
      nutrition: {
        calories: 290,
        protein: 9,
        fat: 15,
        carbs: 34,
        fiber: 8,
        perServing: true,
      },
    },
  ]

  for (const recipeData of recipes) {
    const { ingredients, steps, tags, nutrition, ...recipeInfo } = recipeData
    
    await prisma.recipe.create({
      data: {
        ...recipeInfo,
        ingredients: {
          create: ingredients,
        },
        steps: {
          create: steps,
        },
        tags: {
          create: tags,
        },
        nutrition: nutrition ? {
          create: nutrition,
        } : undefined,
      },
    })
  }

  // Create collections
  const quickMealsCollection = await prisma.collection.create({
    data: {
      title: 'Quick Weeknight Meals',
      description: 'Delicious meals ready in 30 minutes or less',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836',
    },
  })

  const healthyCollection = await prisma.collection.create({
    data: {
      title: 'Healthy & Balanced',
      description: 'Nutritious meals for a balanced lifestyle',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    },
  })

  const italianCollection = await prisma.collection.create({
    data: {
      title: 'Italian Classics',
      description: 'Authentic Italian recipes to transport you to Italy',
      featured: true,
      imageUrl: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85',
    },
  })

  // Link recipes to collections
  const allRecipes = await prisma.recipe.findMany()
  
  await prisma.collectionRecipe.createMany({
    data: [
      { collectionId: quickMealsCollection.id, recipeId: allRecipes[1].id, sortOrder: 0 },
      { collectionId: quickMealsCollection.id, recipeId: allRecipes[2].id, sortOrder: 1 },
      { collectionId: quickMealsCollection.id, recipeId: allRecipes[3].id, sortOrder: 2 },
      { collectionId: healthyCollection.id, recipeId: allRecipes[1].id, sortOrder: 0 },
      { collectionId: healthyCollection.id, recipeId: allRecipes[2].id, sortOrder: 1 },
      { collectionId: healthyCollection.id, recipeId: allRecipes[4].id, sortOrder: 2 },
      { collectionId: italianCollection.id, recipeId: allRecipes[0].id, sortOrder: 0 },
      { collectionId: italianCollection.id, recipeId: allRecipes[3].id, sortOrder: 1 },
    ],
  })

  console.log('✅ Seed completed successfully')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
