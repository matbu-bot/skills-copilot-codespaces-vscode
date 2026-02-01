'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { Button } from './ui/Button'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  if (!session) return null

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="text-2xl font-bold text-primary-500">
            LuMa
          </Link>
          
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`hover:text-primary-500 transition-colors ${
                isActive('/dashboard') ? 'text-primary-500 font-semibold' : 'text-gray-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/recipes"
              className={`hover:text-primary-500 transition-colors ${
                isActive('/recipes') ? 'text-primary-500 font-semibold' : 'text-gray-700'
              }`}
            >
              Recipes
            </Link>
            <Link
              href="/recipes/feed"
              className={`hover:text-primary-500 transition-colors ${
                isActive('/recipes/feed') ? 'text-primary-500 font-semibold' : 'text-gray-700'
              }`}
            >
              Discover
            </Link>
            <Link
              href="/planner"
              className={`hover:text-primary-500 transition-colors ${
                isActive('/planner') ? 'text-primary-500 font-semibold' : 'text-gray-700'
              }`}
            >
              Planner
            </Link>
            <Link
              href="/collections"
              className={`hover:text-primary-500 transition-colors ${
                isActive('/collections') ? 'text-primary-500 font-semibold' : 'text-gray-700'
              }`}
            >
              Collections
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
