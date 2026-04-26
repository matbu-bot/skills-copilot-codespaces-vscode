'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { Navbar } from '@/components/ui/Navbar'

const DIETARY_OPTIONS = ['Vegetarian', 'Vegan', 'Pescatarian', 'Gluten-Free', 'Dairy-Free', 'Keto', 'Paleo', 'Mediterranean']
const CUISINE_OPTIONS = ['Italian', 'Mexican', 'Asian', 'Mediterranean', 'Indian', 'Thai', 'French', 'American', 'Japanese', 'Greek']
const HEALTH_GOALS = ['Weight Loss', 'Muscle Gain', 'Heart Healthy', 'Energy Boost', 'Balanced Diet', 'Anti-Inflammatory']
const SKILL_LEVELS = ['Beginner', 'Home Cook', 'Confident', 'Advanced', 'Pro']
const PLANNING_STYLES = ['Strict Weekly', 'Flexible', 'Family-First', 'Health-Focused', 'Adventurous']

export default function ProfilePage() {
  const { data: session } = useSession()
  const [householdSize, setHouseholdSize] = useState(2)
  const [servingSize, setServingSize] = useState(2)
  const [timeAvailable, setTimeAvailable] = useState(30)
  const [skillLevel, setSkillLevel] = useState(1)
  const [planningStyle, setPlanningStyle] = useState('Flexible')
  const [dietaryPrefs, setDietaryPrefs] = useState<string[]>([])
  const [cuisines, setCuisines] = useState<string[]>([])
  const [healthGoals, setHealthGoals] = useState<string[]>([])
  const [notifications, setNotifications] = useState({
    weeklyPlan: true,
    newRecipes: false,
    shopping: true,
  })
  const [saved, setSaved] = useState(false)

  const toggleChip = (list: string[], setList: (v: string[]) => void, val: string) => {
    setList(list.includes(val) ? list.filter(x => x !== val) : [...list, val])
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const TIME_OPTIONS = [15, 20, 30, 45, 60]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Profile header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 mb-8 text-white flex items-center gap-5">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
            {session?.user?.name?.[0] ?? '?'}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{session?.user?.name ?? 'Your Profile'}</h1>
            <p className="text-primary-100 mt-1">{session?.user?.email ?? ''}</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Household */}
          <Section title="🏠 Household">
            <div className="flex gap-8">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Household Size</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setHouseholdSize(Math.max(1, householdSize - 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
                  <span className="w-8 text-center font-semibold">{householdSize}</span>
                  <button onClick={() => setHouseholdSize(householdSize + 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">Default Servings</p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setServingSize(Math.max(1, servingSize - 1))} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">−</button>
                  <span className="w-8 text-center font-semibold">{servingSize}</span>
                  <button onClick={() => setServingSize(servingSize + 1)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50">+</button>
                </div>
              </div>
            </div>
          </Section>

          {/* Dietary Preferences */}
          <Section title="🥗 Dietary Preferences">
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleChip(dietaryPrefs, setDietaryPrefs, opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${dietaryPrefs.includes(opt) ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'}`}>{opt}</button>
              ))}
            </div>
          </Section>

          {/* Cuisines */}
          <Section title="🌍 Cuisines I Love">
            <div className="flex flex-wrap gap-2">
              {CUISINE_OPTIONS.map(opt => (
                <button key={opt} onClick={() => toggleChip(cuisines, setCuisines, opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${cuisines.includes(opt) ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>{opt}</button>
              ))}
            </div>
          </Section>

          {/* Health Goals */}
          <Section title="🎯 Health Goals">
            <div className="flex flex-wrap gap-2">
              {HEALTH_GOALS.map(opt => (
                <button key={opt} onClick={() => toggleChip(healthGoals, setHealthGoals, opt)} className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${healthGoals.includes(opt) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'}`}>{opt}</button>
              ))}
            </div>
          </Section>

          {/* Cooking Style */}
          <Section title="👨‍🍳 Cooking Style">
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-3">Skill Level: <span className="text-primary-600 font-semibold">{SKILL_LEVELS[skillLevel]}</span></p>
              <input type="range" min="0" max="4" value={skillLevel} onChange={e => setSkillLevel(Number(e.target.value))} className="w-full accent-primary-500" />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                {SKILL_LEVELS.map(l => <span key={l}>{l}</span>)}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Time Available</p>
              <div className="flex flex-wrap gap-2">
                {TIME_OPTIONS.map(t => (
                  <button key={t} onClick={() => setTimeAvailable(t)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${timeAvailable === t ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>{t}min</button>
                ))}
                <button onClick={() => setTimeAvailable(120)} className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${timeAvailable === 120 ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-600 border-gray-200 hover:border-primary-400'}`}>60+min</button>
              </div>
            </div>
          </Section>

          {/* Meal Planning Style */}
          <Section title="📅 Meal Planning Style">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PLANNING_STYLES.map(style => (
                <label key={style} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${planningStyle === style ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-primary-300'}`}>
                  <input type="radio" name="planningStyle" value={style} checked={planningStyle === style} onChange={() => setPlanningStyle(style)} className="accent-primary-500" />
                  <span className="text-sm font-medium">{style}</span>
                </label>
              ))}
            </div>
          </Section>

          {/* Notifications */}
          <Section title="🔔 Notifications">
            <div className="space-y-3">
              {([
                ['weeklyPlan', 'Weekly Plan Reminder'],
                ['newRecipes', 'New Recipe Alerts'],
                ['shopping', 'Shopping Reminders'],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">{label}</span>
                  <button
                    onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`w-12 h-6 rounded-full transition-colors relative ${notifications[key] ? 'bg-primary-500' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[key] ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              ))}
            </div>
          </Section>

          {/* Account */}
          <Section title="🔐 Account">
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50">Change Password</button>
              <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50">Sign Out</button>
            </div>
          </Section>

          {/* Save */}
          <div className="pt-2">
            <button onClick={handleSave} className={`w-full py-3 rounded-xl font-semibold text-white transition-colors ${saved ? 'bg-green-500' : 'bg-primary-500 hover:bg-primary-600'}`}>
              {saved ? '✅ Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">{title}</h2>
      {children}
    </div>
  )
}
