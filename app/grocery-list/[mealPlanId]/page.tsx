'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Button } from '@/components/ui/Button'

interface GroceryItem {
  id: string
  name: string
  quantity: number
  unit: string
  category: string
  checked: boolean
  alreadyHave: boolean
}

export default function GroceryListPage() {
  const params = useParams()
  const router = useRouter()
  const [groceryList, setGroceryList] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.mealPlanId) {
      loadGroceryList(params.mealPlanId as string)
    }
  }, [params])

  const loadGroceryList = async (mealPlanId: string) => {
    try {
      const response = await fetch(`/api/grocery-lists/${mealPlanId}`)
      const data = await response.json()
      setGroceryList(data)
    } catch (error) {
      console.error('Failed to load grocery list:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleItem = async (itemId: string, field: 'checked' | 'alreadyHave', value: boolean) => {
    try {
      await fetch(`/api/grocery-lists/${params?.mealPlanId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, [field]: value }),
      })

      setGroceryList((prev: any) => ({
        ...prev,
        items: prev.items.map((item: GroceryItem) =>
          item.id === itemId ? { ...item, [field]: value } : item
        ),
      }))
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const groupByCategory = (items: GroceryItem[]) => {
    const grouped: Record<string, GroceryItem[]> = {}
    items.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })
    return grouped
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-xl">Loading grocery list...</div>
        </div>
      </div>
    )
  }

  const groupedItems = groceryList ? groupByCategory(groceryList.items) : {}

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Grocery List 🛒</h1>
            <Button variant="outline" onClick={() => router.back()}>
              Back to Planner
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="border-b last:border-b-0">
                <div className="bg-gray-50 px-6 py-3">
                  <h2 className="font-semibold text-lg capitalize">{category}</h2>
                </div>
                <div className="p-6 space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => toggleItem(item.id, 'checked', e.target.checked)}
                        className="w-5 h-5 text-primary-500 rounded"
                      />
                      <span className={`flex-1 ${item.checked ? 'line-through text-gray-400' : ''}`}>
                        {item.quantity} {item.unit} {item.name}
                      </span>
                      <label className="flex items-center text-sm text-gray-600">
                        <input
                          type="checkbox"
                          checked={item.alreadyHave}
                          onChange={(e) => toggleItem(item.id, 'alreadyHave', e.target.checked)}
                          className="mr-1"
                        />
                        Have it
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 mb-2">
              💡 <strong>Pro tip:</strong> Export this list to Instacart for one-click ordering!
            </p>
            <Button variant="outline" size="sm" disabled>
              Export to Instacart (Coming Soon)
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
