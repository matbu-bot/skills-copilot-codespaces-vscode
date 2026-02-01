'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/Button'

const DIETARY_PATTERNS = ['vegetarian', 'vegan', 'pescatarian', 'gluten-free', 'dairy-free', 'keto', 'paleo']
const CUISINES = ['italian', 'mexican', 'asian', 'mediterranean', 'indian', 'american', 'french', 'thai']
const HEALTH_GOALS = ['balanced-diet', 'weight-loss', 'muscle-gain', 'heart-healthy', 'energy-boost']

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    dietaryPatterns: [] as string[],
    allergies: [] as string[],
    dislikedIngredients: [] as string[],
    timeToCook: 30,
    cuisines: [] as string[],
    healthGoals: [] as string[],
    householdSize: 2,
    weeklyCookingCadence: 5,
  })

  const toggleSelection = (field: keyof typeof formData, value: string) => {
    const current = formData[field] as string[]
    if (current.includes(value)) {
      setFormData({ ...formData, [field]: current.filter(v => v !== value) })
    } else {
      setFormData({ ...formData, [field]: [...current, value] })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/recipes/feed')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 mx-1 rounded ${
                  i <= step ? 'bg-primary-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Step {step} of 3</p>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Tell us about your diet</h2>
            
            <div className="mb-6">
              <label className="block font-semibold mb-2">Dietary Patterns</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_PATTERNS.map((pattern) => (
                  <button
                    key={pattern}
                    onClick={() => toggleSelection('dietaryPatterns', pattern)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${
                      formData.dietaryPatterns.includes(pattern)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {pattern}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Household Size</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData.householdSize}
                onChange={(e) => setFormData({ ...formData, householdSize: parseInt(e.target.value) })}
                className="w-32 px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">What do you like to cook?</h2>
            
            <div className="mb-6">
              <label className="block font-semibold mb-2">Favorite Cuisines</label>
              <div className="flex flex-wrap gap-2">
                {CUISINES.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => toggleSelection('cuisines', cuisine)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${
                      formData.cuisines.includes(cuisine)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Time to Cook (minutes)</label>
              <input
                type="number"
                min="10"
                max="180"
                step="5"
                value={formData.timeToCook}
                onChange={(e) => setFormData({ ...formData, timeToCook: parseInt(e.target.value) })}
                className="w-32 px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Your health goals</h2>
            
            <div className="mb-6">
              <label className="block font-semibold mb-2">Health Goals</label>
              <div className="flex flex-wrap gap-2">
                {HEALTH_GOALS.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleSelection('healthGoals', goal)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${
                      formData.healthGoals.includes(goal)
                        ? 'bg-primary-500 text-white border-primary-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-primary-500'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold mb-2">Weekly Cooking Cadence</label>
              <input
                type="number"
                min="1"
                max="21"
                value={formData.weeklyCookingCadence}
                onChange={(e) => setFormData({ ...formData, weeklyCookingCadence: parseInt(e.target.value) })}
                className="w-32 px-4 py-2 border rounded-lg"
              />
              <p className="text-sm text-gray-600 mt-1">How many meals per week?</p>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Back
          </Button>
          
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              Complete
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
