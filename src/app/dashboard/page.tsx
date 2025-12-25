'use client'

import { useQuery } from '@apollo/client'
import Link from 'next/link'
import { 
  PlusIcon, 
  ChartBarIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'
import { GET_LOAD_TESTS, GET_LOAD_TEST_STATISTICS } from '@/lib/graphql/queries'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { StatusBadge } from '@/components/common/Badge'
import { formatDistanceToNow } from 'date-fns'

export default function DashboardPage() {
  const { data: testsData, loading: testsLoading } = useQuery(GET_LOAD_TESTS)
  const { data: statsData, loading: statsLoading } = useQuery(GET_LOAD_TEST_STATISTICS)

  if (testsLoading || statsLoading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    )
  }

  const tests = testsData?.loadTests || []
  const stats = statsData?.loadTestStatistics || {}

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">Overview of your load tests</p>
            </div>
            <Link href="/tests/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                New Test
              </Button>
            </Link>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Tests"
              value={stats.totalTests || 0}
              icon={<ChartBarIcon className="h-6 w-6" />}
              color="blue"
            />
            <StatsCard
              title="Completed"
              value={stats.completedTests || 0}
              icon={<CheckCircleIcon className="h-6 w-6" />}
              color="green"
            />
            <StatsCard
              title="Running"
              value={stats.runningTests || 0}
              icon={<ClockIcon className="h-6 w-6" />}
              color="yellow"
            />
            <StatsCard
              title="Failed"
              value={stats.failedTests || 0}
              icon={<XCircleIcon className="h-6 w-6" />}
              color="red"
            />
          </div>

          {/* Recent Tests */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
            {tests.length === 0 ? (
              <div className="text-center py-12">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No load tests yet</p>
                <Link href="/tests/new">
                  <Button>Create Your First Test</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {tests.slice(0, 5).map((test: any) => (
                  <Link key={test.id} href={`/tests/${test.id}`}>
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{test.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {test.method} • {test.targetUrl}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <StatusBadge status={test.status} />
                      </div>
                      <div className="mt-3 flex items-center space-x-4 text-sm text-gray-600">
                        <span>{test.concurrentUsers} users</span>
                        <span>•</span>
                        <span>{test.requestsPerSecond} RPS</span>
                        <span>•</span>
                        <span>{test.durationSeconds}s duration</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

function StatsCard({ title, value, icon, color }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'text-primary-600 bg-primary-50',
    green: 'text-success-600 bg-success-50',
    yellow: 'text-warning-600 bg-warning-50',
    red: 'text-danger-600 bg-danger-50',
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

