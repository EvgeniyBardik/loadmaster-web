'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import { 
  UserCircleIcon, 
  CreditCardIcon,
  CheckCircleIcon,
  SparklesIcon 
} from '@heroicons/react/24/outline'
import { GET_ME } from '@/lib/graphql/queries'
import { UPDATE_PLAN } from '@/lib/graphql/mutations'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { formatDistanceToNow } from 'date-fns'

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Self-hosted deployment',
      'Up to 100 RPS',
      'Basic metrics',
      '3 concurrent tests',
      'Community support',
    ],
    color: 'gray',
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '$49',
    period: '/month',
    description: 'For growing teams',
    features: [
      'Cloud workers',
      'Up to 10,000 RPS',
      'Advanced analytics',
      'Unlimited concurrent tests',
      'Priority support',
      'Slack integration',
    ],
    color: 'primary',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$299',
    period: '/month',
    description: 'For large organizations',
    features: [
      'Unlimited RPS',
      'Multi-region testing (20+ regions)',
      'White-label solution',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
      'Advanced security',
    ],
    color: 'purple',
    popular: false,
  },
]

export default function ProfilePage() {
  const { data, loading, refetch } = useQuery(GET_ME)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const [updatePlan, { loading: updating }] = useMutation(UPDATE_PLAN, {
    onCompleted: (data) => {
      refetch()
      setSelectedPlan(null)
    },
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    )
  }

  const user = data?.me
  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <p className="text-center text-gray-600">User not found</p>
          </Card>
        </div>
      </>
    )
  }

  const currentPlan = PLANS.find(p => p.id === user.plan) || PLANS[0]

  const handleUpgradePlan = async (planId: string) => {
    if (confirm(`Are you sure you want to switch to the ${planId} plan?`)) {
      await updatePlan({ variables: { plan: planId } })
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile & Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account and subscription</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Info */}
            <Card className="lg:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="h-16 w-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserCircleIcon className="h-10 w-10 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <InfoItem label="Account Created" value={formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })} />
                <InfoItem label="User ID" value={user.id.substring(0, 8) + '...'} />
              </div>
            </Card>

            {/* Current Plan */}
            <Card>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCardIcon className="h-5 w-5 mr-2 text-primary-600" />
                Current Plan
              </h3>
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-lg mb-4">
                <div className="text-3xl font-bold text-primary-900 mb-1">
                  {currentPlan.name}
                </div>
                <div className="text-primary-700">{currentPlan.price}{currentPlan.period}</div>
              </div>
              <p className="text-sm text-gray-600 mb-4">{currentPlan.description}</p>
              {user.cloudEnabled && (
                <div className="flex items-center text-sm text-success-600 bg-success-50 p-2 rounded">
                  <CheckCircleIcon className="h-4 w-4 mr-2" />
                  Cloud features enabled
                </div>
              )}
            </Card>
          </div>

          {/* Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PLANS.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  currentPlan={user.plan}
                  onSelect={() => setSelectedPlan(plan.id)}
                  onUpgrade={() => handleUpgradePlan(plan.id)}
                  loading={updating && selectedPlan === plan.id}
                />
              ))}
            </div>
          </div>

          {/* Plan Features Comparison */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Feature Comparison</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Free</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Professional</th>
                    <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <FeatureRow feature="Max RPS" free="100" pro="10,000" enterprise="Unlimited" />
                  <FeatureRow feature="Concurrent Tests" free="3" pro="Unlimited" enterprise="Unlimited" />
                  <FeatureRow feature="Test Duration" free="5 min" pro="60 min" enterprise="Unlimited" />
                  <FeatureRow feature="Cloud Workers" free="❌" pro="✅" enterprise="✅" />
                  <FeatureRow feature="Multi-region" free="❌" pro="❌" enterprise="✅ (20+)" />
                  <FeatureRow feature="Advanced Analytics" free="❌" pro="✅" enterprise="✅" />
                  <FeatureRow feature="Priority Support" free="❌" pro="✅" enterprise="✅ + Dedicated" />
                  <FeatureRow feature="White-label" free="❌" pro="❌" enterprise="✅" />
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </>
  )
}

function PlanCard({ plan, currentPlan, onSelect, onUpgrade, loading }: any) {
  const isCurrent = plan.id === currentPlan
  const isUpgrade = plan.id !== 'free' && currentPlan === 'free'
  const isDowngrade = plan.id === 'free' && currentPlan !== 'free'

  const colorClasses: Record<string, string> = {
    gray: 'border-gray-300',
    primary: 'border-primary-500 ring-2 ring-primary-200',
    purple: 'border-purple-500',
  }

  return (
    <Card className={`relative ${colorClasses[plan.color]} ${plan.popular ? 'shadow-lg' : ''}`}>
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-600 text-white">
            <SparklesIcon className="h-3 w-3 mr-1" />
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <div className="text-4xl font-bold text-gray-900 mb-1">
          {plan.price}
          {plan.period && <span className="text-lg text-gray-500">{plan.period}</span>}
        </div>
        <p className="text-sm text-gray-600">{plan.description}</p>
      </div>

      <ul className="space-y-3 mb-6">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-start text-sm">
            <CheckCircleIcon className="h-5 w-5 text-success-600 mr-2 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>

      {isCurrent ? (
        <Button variant="secondary" disabled className="w-full">
          Current Plan
        </Button>
      ) : (
        <Button
          onClick={onUpgrade}
          loading={loading}
          variant={isUpgrade ? 'primary' : 'secondary'}
          className="w-full"
        >
          {isUpgrade ? 'Upgrade' : isDowngrade ? 'Downgrade' : 'Switch Plan'}
        </Button>
      )}
    </Card>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}

function FeatureRow({ feature, free, pro, enterprise }: any) {
  return (
    <tr>
      <td className="py-3 px-4 text-sm text-gray-900">{feature}</td>
      <td className="py-3 px-4 text-sm text-center text-gray-700">{free}</td>
      <td className="py-3 px-4 text-sm text-center text-gray-700">{pro}</td>
      <td className="py-3 px-4 text-sm text-center text-gray-700">{enterprise}</td>
    </tr>
  )
}

