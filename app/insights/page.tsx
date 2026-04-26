import { Navbar } from '@/components/ui/Navbar'

export default function InsightsPage() {
  const weekDate = new Date()
  const weekStart = new Date(weekDate)
  // getDay() returns 0=Sunday...6=Saturday; adjust to start on Monday
  const dayOfWeek = weekDate.getDay()
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  weekStart.setDate(weekDate.getDate() - daysFromMonday)
  const weekLabel = weekStart.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  const macros = {
    calories: { current: 2100, goal: 2200, label: 'Calories', unit: 'kcal/day avg', color: 'bg-orange-400' },
    protein: { current: 68, goal: 80, label: 'Protein', unit: 'g/day avg', color: 'bg-blue-400' },
    carbs: { current: 220, goal: 250, label: 'Carbs', unit: 'g/day avg', color: 'bg-yellow-400' },
    fat: { current: 72, goal: 75, label: 'Fat', unit: 'g/day avg', color: 'bg-green-400' },
  }

  const observations = [
    { emoji: '🥩', title: 'Protein Check', text: 'Your average protein is slightly below your 80g/day goal. Consider adding a chicken or lentil dish.' },
    { emoji: '⏱️', title: 'Prep-Time Load', text: '3 of your dinners this week take over 45 minutes. Swap one for a 20-minute option to reduce stress.' },
    { emoji: '🌈', title: 'Variety Score', text: '7/10 – Good variety across cuisines this week! You\'re covering Mediterranean, Asian, and Mexican.' },
    { emoji: '💰', title: 'Cost Estimate', text: '~$85 estimated grocery spend for this week\'s plan. Well within typical budget.' },
  ]

  const suggestions = [
    'Add a high-protein breakfast like Greek yogurt or eggs to boost daily protein.',
    'Try a sheet-pan dinner this week — minimal prep, maximum flavor.',
    'Batch cook your grains on Sunday to save 30+ minutes during the week.',
  ]

  const lastWeek = { calories: 1980, protein: 62, carbs: 240, fat: 68 }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Weekly Insights</h1>
          <p className="text-gray-500 mt-1">Week of {weekLabel}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(macros).map(([key, m]) => (
            <div key={key} className="bg-white rounded-2xl shadow-sm p-5">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{m.label}</p>
              <p className="text-2xl font-bold text-gray-800">{m.current}</p>
              <p className="text-xs text-gray-400 mb-3">{m.unit}</p>
              <div className="h-2 bg-gray-100 rounded-full">
                <div className={`h-2 rounded-full ${m.color} transition-all`} style={{ width: `${Math.min(100, (m.current / m.goal) * 100)}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1">Goal: {m.goal}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Observations */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Observations</h2>
            <div className="space-y-3">
              {observations.map((obs, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-4 flex gap-3">
                  <span className="text-2xl">{obs.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{obs.title}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{obs.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donut Chart */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Macros Breakdown</h2>
            <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center">
              <svg viewBox="0 0 120 120" className="w-36 h-36 mb-4">
                {/* Simple donut chart using SVG */}
                {(() => {
                  const segments = [
                    { value: macros.protein.current, color: '#60a5fa', label: 'Protein' },
                    { value: macros.carbs.current, color: '#facc15', label: 'Carbs' },
                    { value: macros.fat.current, color: '#4ade80', label: 'Fat' },
                  ]
                  const total = segments.reduce((sum, s) => sum + s.value, 0)
                  const r = 45
                  const cx = 60
                  const cy = 60
                  let startAngle = -90
                  return segments.map((seg, i) => {
                    const pct = seg.value / total
                    const angle = pct * 360
                    const endAngle = startAngle + angle
                    const start = { x: cx + r * Math.cos((startAngle * Math.PI) / 180), y: cy + r * Math.sin((startAngle * Math.PI) / 180) }
                    const end = { x: cx + r * Math.cos((endAngle * Math.PI) / 180), y: cy + r * Math.sin((endAngle * Math.PI) / 180) }
                    const largeArc = angle > 180 ? 1 : 0
                    const path = `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y} Z`
                    startAngle = endAngle
                    return <path key={i} d={path} fill={seg.color} opacity="0.85" />
                  })
                })()}
                <circle cx="60" cy="60" r="28" fill="white" />
                <text x="60" y="57" textAnchor="middle" className="text-xs" fontSize="8" fill="#374151">{macros.calories.current.toLocaleString()}</text>
                <text x="60" y="67" textAnchor="middle" fontSize="7" fill="#9ca3af">kcal</text>
              </svg>
              <div className="space-y-1.5 w-full">
                {[
                  { label: 'Protein', color: '#60a5fa', value: `${macros.protein.current}g`, pct: `${Math.round((macros.protein.current / (macros.protein.current + macros.carbs.current + macros.fat.current)) * 100)}%` },
                  { label: 'Carbs', color: '#facc15', value: `${macros.carbs.current}g`, pct: `${Math.round((macros.carbs.current / (macros.protein.current + macros.carbs.current + macros.fat.current)) * 100)}%` },
                  { label: 'Fat', color: '#4ade80', value: `${macros.fat.current}g`, pct: `${Math.round((macros.fat.current / (macros.protein.current + macros.carbs.current + macros.fat.current)) * 100)}%` },
                ].map(({ label, color, value, pct }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-sm text-gray-600 flex-1">{label}</span>
                    <span className="text-sm font-medium">{value}</span>
                    <span className="text-xs text-gray-400">{pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* This Week vs Last Week */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">This Week vs Last Week</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Calories', this: 2100, last: lastWeek.calories },
              { label: 'Protein', this: 68, last: lastWeek.protein },
              { label: 'Carbs', this: 220, last: lastWeek.carbs },
              { label: 'Fat', this: 72, last: lastWeek.fat },
            ].map(item => {
              const diff = item.this - item.last
              const pct = Math.round((diff / item.last) * 100)
              return (
                <div key={item.label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                  <p className="text-xl font-bold">{item.this}</p>
                  <p className={`text-sm font-medium ${diff > 0 ? 'text-green-500' : 'text-red-400'}`}>{diff > 0 ? '▲' : '▼'} {Math.abs(pct)}%</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">💡 Suggestions</h2>
          <ul className="space-y-3">
            {suggestions.map((s, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="text-primary-500 font-bold">{i + 1}.</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Coming Soon */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {['🩺 Biomarker Integration', '⌚ Wearable Sync'].map(feature => (
            <div key={feature} className="bg-gray-100 border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">{feature.split(' ')[0]}</p>
              <p className="font-semibold text-gray-600">{feature.split(' ').slice(1).join(' ')}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-gray-200 text-gray-500 text-xs rounded-full font-medium">Coming Soon</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
