import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const profileSchema = z.object({
  dietaryPatterns: z.array(z.string()),
  allergies: z.array(z.string()),
  dislikedIngredients: z.array(z.string()),
  timeToCook: z.number().min(0).nullable(),
  cuisines: z.array(z.string()),
  healthGoals: z.array(z.string()),
  householdSize: z.number().min(1).max(20),
  weeklyCookingCadence: z.number().min(1).max(21),
})

export const recipeSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  prepTime: z.number().min(0).nullable(),
  totalTime: z.number().min(1, 'Total time is required'),
  servings: z.number().min(1, 'Servings must be at least 1'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().min(0).nullable(),
    unit: z.string().optional(),
    notes: z.string().optional(),
  })).min(1, 'At least one ingredient is required'),
  steps: z.array(z.object({
    stepNumber: z.number(),
    instruction: z.string().min(1),
  })).min(1, 'At least one step is required'),
  tags: z.array(z.object({
    tagType: z.string(),
    tagValue: z.string(),
  })).optional(),
})

export const mealPlanSchema = z.object({
  weekStartDate: z.string().or(z.date()),
  name: z.string().optional(),
})
