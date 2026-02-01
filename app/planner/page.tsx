'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { getWeekStart } from '@/utils/helpers'

interface MealSlot {
  id: string
  dayOfWeek: number
  mealType: string
  recipe: {
    id: string
    title: string
    imageUrl?: string | null
  } | null
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function PlannerPage() {
  const searchParams = useSearchParams()
  const [mealPlan, setMealPlan] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [weekStart, setWeekStart] = useState(getWeekStart())

  useEffect(() => {
    const planId = searchParams?.get('planId')
    if (planId) {
      loadMealPlan(planId)
    }
  }, [searchParams])

  const loadMealPlan = async (planId: string) => {
    try {
      const response = await fetch(`/api/meal-plans/${planId}`)
      const data = await response.json()
      setMealPlan(data)
    } catch (error) {
      console.error('Failed to load meal plan:', error)
    }
  }

  const generatePlan = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/meal-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weekStartDate: weekStart.toISOString(),
          name: `Week of ${weekStart.toLocaleDateString()}`,
        }),
      })

      const data = await response.json()
      setMealPlan(data)
    } catch (error) {
      console.error('Failed to generate meal plan:', error)
    } finally {
      setLoading(false)
    }
  }

  const regenerateSlot = async (slotId: string) => {
    if (!mealPlan) return

    try {
      const response = await fetch(`/api/meal-plans/${mealPlan.id}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotId }),
      })

      const updatedSlot = await response.json()
      
      setMealPlan({
        ...mealPlan,
        mealSlots: mealPlan.mealSlots.map((slot: any) =>
          slot.id === slotId ? updatedSlot : slot
        ),
      })
    } catch (error) {
      console.error('Failed to regenerate slot:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Weekly Meal Planner</h1>
          {!mealPlan && (
            <Button onClick={generatePlan} loading={loading}>
              Generate Week Plan
            </Button>
          )}
          {mealPlan && (
            <Link href={`/grocery-list/${mealPlan.id}`}>
              <Button>View Grocery List</Button>
            </Link>
          )}
        </div>

        {!mealPlan && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">
              No meal plan for this week yet. Generate one based on your preferences!
            </p>
            <Button onClick={generatePlan}>
              Generate My Week
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="text-xl">Generating your personalized meal plan...</div>
          </div>
        )}

        {mealPlan && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {DAYS.map((day, dayIndex) => (
                <div key={day} className="bg-white p-4">
                  <h3 className="font-semibold text-center mb-4">{day}</h3>
                  
                  {mealPlan.mealSlots
                    .filter((slot: MealSlot) => slot.dayOfWeek === dayIndex)
                    .map((slot: MealSlot) => (
                      <div key={slot.id} className="mb-4">
                        {slot.recipe ? (
                          <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
                            <Link href={`/recipes/${slot.recipe.id}`}>
                              <p className="font-semibold text-sm mb-1">
                                {slot.mealType.charAt(0).toUpperCase() + slot.mealType.slice(1)}
                              </p>
                              <p className="text-sm line-clamp-2">{slot.recipe.title}</p>
                            </Link>
                            <button
                              onClick={() => regenerateSlot(slot.id)}
                              className="text-xs text-primary-500 hover:underline mt-2"
                            >
                              🔄 Change
                            </button>
                          </div>
                        ) : (
                          <div className="border border-dashed rounded-lg p-3 text-center text-gray-400 text-sm">
                            No meal
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
