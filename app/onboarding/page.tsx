'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const DIETARY_PATTERNS = ['Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Mediterranean']
const CUISINES = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'Thai', 'French', 'American', 'Japanese', 'Greek']
const HEALTH_GOALS = ['Balanced Diet', 'Weight Loss', 'Muscle Gain', 'Heart Healthy', 'Energy Boost', 'Anti-Inflammatory']
const COOKING_CADENCE = [2, 3, 4, 5, 7, 10, 14, 21]
const TIME_OPTIONS = [15, 20, 30, 45, 60]
const SKILL_LEVELS = ['Beginner', 'Home Cook', 'Confident', 'Advanced', 'Pro']
const PLANNING_STYLES = ['Strict Weekly', 'Flexible', 'Family-First', 'Health-Focused', 'Adventurous']
const PANTRY_STAPLES = ['Oil', 'Salt', 'Garlic', 'Onion', 'Pasta', 'Rice', 'Canned Tomatoes', 'Broth', 'Eggs', 'Flour']

const TOTAL_STEPS = 6

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    householdSize: 2,
    weeklyCookingCadence: 5,
    dietaryPatterns: [] as string[],
    allergies: [] as string[],
    dislikedIngredients: [] as string[],
    cuisines: [] as string[],
    timeToCook: 30,
    healthGoals: [] as string[],
    skillLevel: 'Home Cook',
    planningStyle: 'Flexible',
    creatorInterests: [] as string[],
    pantryStaples: [] as string[],
  })

  const toggle = (field: keyof typeof formData, value: string) => {
    const current = formData[field] as string[]
    setFormData({ ...formData, [field]: current.includes(value) ? current.filter(v => v !== value) : [...current, value] })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dietaryPatterns: formData.dietaryPatterns,
          allergies: formData.allergies,
          dislikedIngredients: formData.dislikedIngredients,
          timeToCook: formData.timeToCook,
          cuisines: formData.cuisines,
          healthGoals: formData.healthGoals,
          householdSize: formData.householdSize,
          weeklyCookingCadence: formData.weeklyCookingCadence,
        }),
      })
      if (response.ok) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const stepMessages = [
    'Welcome! Let\'s get started 🎉',
    'Tell us about your diet 🥗',
    'Cuisines & cooking time 🌍',
    'Your health goals 🎯',
    'Planning style ✨',
    'Almost there! 🏁',
  ]

  const ChipBtn = ({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${active ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 border-gray-200 hover:border-primary-400'}`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-1 mb-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary-500' : 'bg-gray-100'}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500">Step {step} of {TOTAL_STEPS} – {stepMessages[step - 1]}</p>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Hi! Let&apos;s personalize your LuMa experience</h2>
            <p className="text-gray-500 mb-6">Tell us a bit about your household so we can tailor your meal plans.</p>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">Household Size</label>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setFormData({ ...formData, householdSize: Math.max(1, formData.householdSize - 1) })} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-400 text-xl">−</button>
                <span className="text-3xl font-bold text-primary-600">{formData.householdSize}</span>
                <button type="button" onClick={() => setFormData({ ...formData, householdSize: formData.householdSize + 1 })} className="w-10 h-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-400 text-xl">+</button>
                <span className="text-gray-500">{formData.householdSize === 1 ? 'person' : 'people'}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">How many meals do you cook per week?</label>
              <div className="flex flex-wrap gap-2">
                {COOKING_CADENCE.map(n => (
                  <ChipBtn key={n} active={formData.weeklyCookingCadence === n} onClick={() => setFormData({ ...formData, weeklyCookingCadence: n })} label={`${n} meals`} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Dietary */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Dietary preferences &amp; restrictions</h2>
            <p className="text-gray-500 mb-6">Select all that apply. We&apos;ll filter recipes accordingly.</p>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">Dietary Patterns</label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_PATTERNS.map(p => (
                  <ChipBtn key={p} active={formData.dietaryPatterns.includes(p)} onClick={() => toggle('dietaryPatterns', p)} label={p} />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-2">Disliked Ingredients (optional)</label>
              <input
                type="text"
                placeholder="e.g. cilantro, mushrooms, olives"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
                onChange={e => setFormData({ ...formData, dislikedIngredients: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
              />
              <p className="text-xs text-gray-400 mt-1">Separate with commas</p>
            </div>
          </div>
        )}

        {/* Step 3: Cuisines & Time */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Favorite cuisines &amp; cooking time</h2>
            <p className="text-gray-500 mb-6">We&apos;ll prioritize these in your weekly plans.</p>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">Cuisines I Love</label>
              <div className="flex flex-wrap gap-2">
                {CUISINES.map(c => (
                  <ChipBtn key={c} active={formData.cuisines.includes(c)} onClick={() => toggle('cuisines', c)} label={c} />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">Time available per meal</label>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map(t => (
                  <ChipBtn key={t} active={formData.timeToCook === t} onClick={() => setFormData({ ...formData, timeToCook: t })} label={`${t} min`} />
                ))}
                <ChipBtn active={formData.timeToCook === 120} onClick={() => setFormData({ ...formData, timeToCook: 120 })} label="60+ min" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Health Goals & Skill */}
        {step === 4 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Health goals &amp; cooking confidence</h2>
            <p className="text-gray-500 mb-6">This helps us balance nutrition and complexity in your plans.</p>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">Health Goals</label>
              <div className="flex flex-wrap gap-2">
                {HEALTH_GOALS.map(g => (
                  <ChipBtn key={g} active={formData.healthGoals.includes(g)} onClick={() => toggle('healthGoals', g)} label={g} />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-gray-700 mb-3">Cooking Skill: <span className="text-primary-600">{formData.skillLevel}</span></label>
              <input
                type="range"
                min="0"
                max="4"
                value={SKILL_LEVELS.indexOf(formData.skillLevel)}
                onChange={e => setFormData({ ...formData, skillLevel: SKILL_LEVELS[Number(e.target.value)] })}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {SKILL_LEVELS.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Planning Style */}
        {step === 5 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Meal planning style</h2>
            <p className="text-gray-500 mb-6">How do you like to plan your meals?</p>

            <div className="mb-6">
              <div className="grid grid-cols-1 gap-3">
                {PLANNING_STYLES.map(style => (
                  <label key={style} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${formData.planningStyle === style ? 'border-primary-500 bg-primary-50' : 'border-gray-100 hover:border-primary-300'}`}>
                    <input type="radio" name="planningStyle" value={style} checked={formData.planningStyle === style} onChange={() => setFormData({ ...formData, planningStyle: style })} className="accent-primary-500" />
                    <span className="font-medium text-gray-800">{style}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Pantry Staples */}
        {step === 6 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">What pantry staples do you always have?</h2>
            <p className="text-gray-500 mb-6">We&apos;ll skip these on your grocery list. (Optional)</p>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {PANTRY_STAPLES.map(s => (
                  <ChipBtn key={s} active={formData.pantryStaples.includes(s)} onClick={() => toggle('pantryStaples', s)} label={s} />
                ))}
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <p className="text-primary-700 font-medium">🎉 You&apos;re all set! We&apos;ll generate your first personalized plan right away.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>

          {step < TOTAL_STEPS ? (
            <button type="button" onClick={() => setStep(step + 1)} className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors">
              Next →
            </button>
          ) : (
            <button type="button" onClick={handleSubmit} disabled={loading} className="px-6 py-2.5 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 transition-colors disabled:opacity-70">
              {loading ? 'Saving...' : 'Complete Setup 🚀'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
