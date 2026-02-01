'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Button } from '@/components/ui/Button'

export default function ImportRecipePage() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [importedRecipe, setImportedRecipe] = useState<any>(null)

  const handleImport = async () => {
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/recipes/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) throw new Error('Failed to import recipe')

      const data = await response.json()
      setImportedRecipe(data)
    } catch (err: any) {
      setError(err.message || 'Failed to import recipe')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!importedRecipe) return
    setLoading(true)
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(importedRecipe),
      })

      if (response.ok) {
        const recipe = await response.json()
        router.push(`/recipes/${recipe.id}`)
      }
    } catch (err) {
      setError('Failed to save recipe')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Import Recipe from URL</h1>
        {!importedRecipe ? (
          <div className="bg-white rounded-lg shadow p-6">
            <label className="block text-sm font-medium mb-2">Recipe URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/recipe"
              className="w-full px-4 py-2 border rounded-lg mb-4"
            />
            {error && <div className="bg-red-50 text-red-500 px-4 py-3 rounded-lg mb-4">{error}</div>}
            <Button onClick={handleImport} loading={loading} disabled={!url}>Import Recipe</Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">{importedRecipe.title}</h2>
            <Button onClick={handleSave} loading={loading}>Save to My Recipes</Button>
          </div>
        )}
      </div>
    </div>
  )
}
