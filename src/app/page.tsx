'use client'

import Link from 'next/link'
import { 
  ChartBarIcon, 
  BoltIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BoltIcon className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">LoadMaster</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/auth/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Professional Load Testing
            <span className="block text-primary-600 mt-2">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Test your APIs with distributed workers powered by Rust. 
            Get real-time metrics and beautiful visualizations.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/register" className="btn-primary text-lg px-8 py-3">
              Start Testing Free
            </Link>
            <Link href="/demo" className="btn-secondary text-lg px-8 py-3">
              View Demo
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          <FeatureCard
            icon={<BoltIcon className="h-8 w-8" />}
            title="Lightning Fast"
            description="Rust-powered workers deliver maximum performance"
          />
          <FeatureCard
            icon={<GlobeAltIcon className="h-8 w-8" />}
            title="Global Testing"
            description="Test from multiple regions worldwide"
          />
          <FeatureCard
            icon={<ChartBarIcon className="h-8 w-8" />}
            title="Real-time Metrics"
            description="Watch your tests run with live dashboards"
          />
          <FeatureCard
            icon={<ShieldCheckIcon className="h-8 w-8" />}
            title="Enterprise Ready"
            description="Self-hosted or cloud, your choice"
          />
        </div>

        {/* Architecture Diagram */}
        <div className="mt-20 card max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Architecture</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <pre className="text-sm text-gray-700 overflow-x-auto">
{`┌─────────────┐     GraphQL      ┌──────────────┐
│  NextJS UI  │ ◄──────────────► │  NestJS API  │
└─────────────┘                  └───────┬──────┘
                                         │
                                    RabbitMQ1
                                         │
                          ┌──────────────┼──────────────┐
                          ▼              ▼              ▼
                    ┌─────────┐    ┌─────────┐   ┌─────────┐
                    │ Rust    │    │ Rust    │   │ Rust    │
                    │ Worker  │    │ Worker  │   │ Worker  │
                    └─────────┘    └─────────┘   └─────────┘`}
            </pre>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Free to Start, Scale as You Grow</h2>
          <p className="text-gray-600 mb-8">Self-hosted core is 100% free and open source</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PricingCard
              name="Free"
              price="$0"
              features={[
                'Self-hosted',
                'Up to 100 RPS',
                'Basic metrics',
                'Community support'
              ]}
            />
            <PricingCard
              name="Professional"
              price="$49"
              features={[
                'Cloud workers',
                'Up to 10K RPS',
                'Advanced analytics',
                'Priority support'
              ]}
              highlighted
            />
            <PricingCard
              name="Enterprise"
              price="$299"
              features={[
                'Unlimited RPS',
                '20+ regions',
                'White-label',
                'Dedicated support'
              ]}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-20 border-t border-gray-200">
        <div className="text-center text-gray-600">
          <p>© 2024 LoadMaster. Open Source Load Testing Platform.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="card text-center hover:shadow-lg transition-shadow">
      <div className="flex justify-center text-primary-600 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

function PricingCard({ name, price, features, highlighted }: any) {
  return (
    <div className={`card ${highlighted ? 'ring-2 ring-primary-600' : ''}`}>
      {highlighted && (
        <span className="badge-info mb-4">Most Popular</span>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-gray-600">/month</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature: string, i: number) => (
          <li key={i} className="flex items-center text-gray-700">
            <ShieldCheckIcon className="h-5 w-5 text-success-600 mr-2" />
            {feature}
          </li>
        ))}
      </ul>
      <button className={highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}>
        Choose Plan
      </button>
    </div>
  )
}

