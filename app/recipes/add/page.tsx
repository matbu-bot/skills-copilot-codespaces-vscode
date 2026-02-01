'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function AddRecipePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: 15,
    totalTime: 30,
    servings: 4,
    imageUrl: '',
    ingredients: [{ name: '', quantity: 1, unit: 'cup' }],
    steps: [{ stepNumber: 1, instruction: '' }],
  })

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { name: '', quantity: 1, unit: 'cup' }],
    })
  }

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, { stepNumber: formData.steps.length + 1, instruction: '' }],
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const recipe = await response.json()
        router.push(`/recipes/${recipe.id}`)
      }
    } catch (error) {
      console.error('Failed to create recipe:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Add New Recipe</h1>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
          <Input
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium mb-2">Ingredients</label>
            {formData.ingredients.map((ing, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  value={ing.name}
                  onChange={(e) => {
                    const newIng = [...formData.ingredients]
                    newIng[idx].name = e.target.value
                    setFormData({ ...formData, ingredients: newIng })
                  }}
                  className="flex-1 px-3 py-2 border rounded"
                />
              </div>
            ))}
            <Button type="button" onClick={addIngredient} variant="outline" size="sm">+ Add Ingredient</Button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Steps</label>
            {formData.steps.map((step, idx) => (
              <textarea
                key={idx}
                value={step.instruction}
                onChange={(e) => {
                  const newSteps = [...formData.steps]
                  newSteps[idx].instruction = e.target.value
                  setFormData({ ...formData, steps: newSteps })
                }}
                placeholder={`Step ${idx + 1}`}
                className="w-full px-3 py-2 border rounded mb-2"
                rows={2}
              />
            ))}
            <Button type="button" onClick={addStep} variant="outline" size="sm">+ Add Step</Button>
          </div>
          <Button type="submit" loading={loading} className="w-full">Create Recipe</Button>
        </form>
      </div>
    </div>
  )
}
