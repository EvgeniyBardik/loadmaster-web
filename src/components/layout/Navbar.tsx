'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BoltIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'
import { useAuthStore } from '@/store/auth-store'
import { logout } from '@/lib/auth'
import { clsx } from 'clsx'

export function Navbar() {
  const pathname = usePathname()
  const { user } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Tests', href: '/tests' },
    { name: 'Analytics', href: '/analytics' },
    { name: 'Profile', href: '/profile' },
  ]

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <BoltIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">LoadMaster</span>
            </Link>

            <div className="hidden md:flex space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{user?.name}</div>
              <div className="text-gray-500 capitalize">{user?.plan} Plan</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

