'use client'

import Link from 'next/link'
import { 
  WrenchScrewdriverIcon,
  ClockIcon,
  BoltIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Icon with animation */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary-200 rounded-full animate-ping opacity-75"></div>
            <div className="relative bg-primary-100 rounded-full p-6">
              <WrenchScrewdriverIcon className="h-16 w-16 text-primary-600 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Main message */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Page Under Development
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          We're actively working on the demo
        </p>
        <p className="text-lg text-gray-500 mb-8">
          An interactive demonstration of LoadMaster capabilities will be available soon
        </p>

        {/* Features preview */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-4">
            <ClockIcon className="h-6 w-6 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-gray-700">What will be available:</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start">
              <BoltIcon className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Interactive Tests</p>
                <p className="text-sm text-gray-600">Try running a load test</p>
              </div>
            </div>
            <div className="flex items-start">
              <BoltIcon className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Live Metrics</p>
                <p className="text-sm text-gray-600">Watch results in real-time</p>
              </div>
            </div>
            <div className="flex items-start">
              <BoltIcon className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Example Scenarios</p>
                <p className="text-sm text-gray-600">Ready-made testing templates</p>
              </div>
            </div>
            <div className="flex items-start">
              <BoltIcon className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900">Data Visualization</p>
                <p className="text-sm text-gray-600">Beautiful charts and reports</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center btn-secondary px-6 py-3"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <Link 
            href="/auth/register" 
            className="btn-primary px-6 py-3"
          >
            Sign Up
          </Link>
        </div>

        {/* Progress indicator */}
        <div className="mt-12">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <p className="text-sm text-gray-500">We're working on it...</p>
        </div>
      </div>
    </div>
  )
}

