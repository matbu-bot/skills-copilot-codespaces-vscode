import { prisma } from '@/lib/prisma'

const mealPlanGeneratorModule = require('@/services/mealPlanGenerator')

jest.mock('@/lib/prisma', () => ({
  prisma: {
    userProfile: {
      findUnique: jest.fn(),
    },
    recipePreference: {
      findMany: jest.fn(),
    },
    recipe: {
      findMany: jest.fn(),
    },
    mealSlot: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    mealPlan: {},
  },
}))

describe('Meal Plan Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('generateMealPlan', () => {
    const defaultProfile = {
      id: 'profile1',
      userId: 'user1',
      dietaryPatterns: ['vegetarian'],
      householdSize: 4,
      timeToCook: 45,
    }

    const mockRecipes = [
      {
        id: 'recipe1',
        title: 'Pasta',
        totalTime: 30,
        tags: [{ tagType: 'dietary', tagValue: 'vegetarian' }],
        nutrition: {},
      },
      {
        id: 'recipe2',
        title: 'Salad',
        totalTime: 15,
        tags: [{ tagType: 'dietary', tagValue: 'vegetarian' }],
        nutrition: {},
      },
      {
        id: 'recipe3',
        title: 'Stir Fry',
        totalTime: 25,
        tags: [{ tagType: 'dietary', tagValue: 'vegetarian' }],
        nutrition: {},
      },
    ]

    it('should generate a week of meal plans', async () => {
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      const result = await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      expect(result).toHaveLength(7) // 7 days
      expect(result[0]).toHaveProperty('dayOfWeek')
      expect(result[0]).toHaveProperty('mealType')
      expect(result[0]).toHaveProperty('recipeId')
      expect(result[0].servings).toBe(4) // household size
    })

    it('should respect dietary constraints', async () => {
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      // Should query with dietary filter
      expect(prisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: {
              some: {
                tagType: 'dietary',
                tagValue: { in: ['vegetarian'] },
              },
            },
          }),
        })
      )
    })

    it('should prioritize liked recipes', async () => {
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([
        { recipeId: 'recipe2' },
        { recipeId: 'recipe3' },
      ])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      const result = await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      // First meals should prefer liked recipes
      const firstRecipe = result[0].recipeId
      expect(['recipe2', 'recipe3']).toContain(firstRecipe)
    })

    it('should avoid specified recipes', async () => {
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
        avoidRecipeIds: ['recipe1'],
      })

      expect(prisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { notIn: ['recipe1'] },
          }),
        })
      )
    })

    it('should respect time constraints', async () => {
      const profileWithTime = { ...defaultProfile, timeToCook: 20 }
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(profileWithTime)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      expect(prisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            totalTime: { lte: 20 },
          }),
        })
      )
    })

    it('should throw error when no recipes available', async () => {
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue([])

      await expect(
        mealPlanGeneratorModule.generateMealPlan({
          userId: 'user1',
          weekStartDate: new Date('2024-01-01'),
        })
      ).rejects.toThrow('No recipes available')
    })

    it('should handle limited recipe pool by cycling', async () => {
      const limitedRecipes = [mockRecipes[0], mockRecipes[1]] // Only 2 recipes
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(limitedRecipes)

      const result = await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      expect(result).toHaveLength(7)
      // Should have some duplicate recipe IDs since only 2 recipes available
      const uniqueRecipes = new Set(result.map(slot => slot.recipeId))
      expect(uniqueRecipes.size).toBeLessThanOrEqual(2)
    })

    it('should default to 1 meal per day', async () => {
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(defaultProfile)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      const result = await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      // Should only plan dinner by default
      expect(result.every(slot => slot.mealType === 'dinner')).toBe(true)
    })

    it('should use household size from profile for servings', async () => {
      const profileWithSize = { ...defaultProfile, householdSize: 6 }
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(profileWithSize)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      const result = await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      expect(result[0].servings).toBe(6)
    })

    it('should default to 4 servings if no household size', async () => {
      const profileNoSize = { ...defaultProfile, householdSize: undefined }
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(profileNoSize)
      ;(prisma.recipePreference.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(mockRecipes)

      const result = await mealPlanGeneratorModule.generateMealPlan({
        userId: 'user1',
        weekStartDate: new Date('2024-01-01'),
      })

      expect(result[0].servings).toBe(4)
    })
  })

  describe('regenerateMealSlot', () => {
    const mockSlot = {
      id: 'slot1',
      mealPlanId: 'plan1',
      dayOfWeek: 0,
      mealType: 'dinner',
      recipeId: 'recipe1',
      locked: false,
      servings: 4,
      mealPlan: { userId: 'user1' },
    }

    const mockProfile = {
      id: 'profile1',
      userId: 'user1',
      dietaryPatterns: ['vegetarian'],
    }

    const alternativeRecipes = [
      { id: 'recipe2', title: 'Alternative 1' },
      { id: 'recipe3', title: 'Alternative 2' },
    ]

    it('should find an alternative recipe', async () => {
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(mockSlot)
      ;(prisma.mealSlot.findMany as jest.Mock).mockResolvedValue([
        { recipeId: 'recipe1' },
      ])
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile)
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(alternativeRecipes)

      const newRecipeId = await mealPlanGeneratorModule.regenerateMealSlot(
        'plan1',
        'slot1'
      )

      expect(['recipe2', 'recipe3']).toContain(newRecipeId)
    })

    it('should throw error for locked slots', async () => {
      const lockedSlot = { ...mockSlot, locked: true }
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(lockedSlot)

      await expect(
        mealPlanGeneratorModule.regenerateMealSlot('plan1', 'slot1')
      ).rejects.toThrow('Cannot regenerate locked')
    })

    it('should throw error for non-existent slots', async () => {
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(
        mealPlanGeneratorModule.regenerateMealSlot('plan1', 'slot1')
      ).rejects.toThrow('Cannot regenerate locked or non-existent slot')
    })

    it('should avoid current plan recipes', async () => {
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(mockSlot)
      ;(prisma.mealSlot.findMany as jest.Mock).mockResolvedValue([
        { recipeId: 'recipe1' },
        { recipeId: 'recipe2' },
      ])
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile)
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(alternativeRecipes)

      await mealPlanGeneratorModule.regenerateMealSlot('plan1', 'slot1')

      expect(prisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { notIn: expect.arrayContaining(['recipe1', 'recipe2']) },
          }),
        })
      )
    })

    it('should respect avoidRecipeIds parameter', async () => {
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(mockSlot)
      ;(prisma.mealSlot.findMany as jest.Mock).mockResolvedValue([
        { recipeId: 'recipe1' },
      ])
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile)
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(alternativeRecipes)

      await mealPlanGeneratorModule.regenerateMealSlot('plan1', 'slot1', [
        'recipe4',
      ])

      expect(prisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { notIn: expect.arrayContaining(['recipe4']) },
          }),
        })
      )
    })

    it('should throw error when no alternatives found', async () => {
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(mockSlot)
      ;(prisma.mealSlot.findMany as jest.Mock).mockResolvedValue([])
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile)
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue([])

      await expect(
        mealPlanGeneratorModule.regenerateMealSlot('plan1', 'slot1')
      ).rejects.toThrow('No alternative recipes found')
    })

    it('should respect dietary patterns when finding alternatives', async () => {
      ;(prisma.mealSlot.findUnique as jest.Mock).mockResolvedValue(mockSlot)
      ;(prisma.mealSlot.findMany as jest.Mock).mockResolvedValue([
        { recipeId: 'recipe1' },
      ])
      ;(prisma.userProfile.findUnique as jest.Mock).mockResolvedValue(mockProfile)
      ;(prisma.recipe.findMany as jest.Mock).mockResolvedValue(alternativeRecipes)

      await mealPlanGeneratorModule.regenerateMealSlot('plan1', 'slot1')

      expect(prisma.recipe.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            tags: {
              some: {
                tagType: 'dietary',
                tagValue: { in: ['vegetarian'] },
              },
            },
          }),
        })
      )
    })
  })
})
