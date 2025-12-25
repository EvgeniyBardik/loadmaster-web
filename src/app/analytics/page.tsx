'use client'

import { useQuery } from '@apollo/client'
import { 
  ChartBarIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  BoltIcon 
} from '@heroicons/react/24/outline'
import { GET_LOAD_TESTS, GET_LOAD_TEST_STATISTICS } from '@/lib/graphql/queries'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/common/Card'
import { Loading } from '@/components/common/Loading'

export default function AnalyticsPage() {
  const { data: statsData, loading: statsLoading } = useQuery(GET_LOAD_TEST_STATISTICS)
  const { data: testsData, loading: testsLoading } = useQuery(GET_LOAD_TESTS)

  if (statsLoading || testsLoading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    )
  }

  const stats = statsData?.loadTestStatistics || {}
  const tests = testsData?.loadTests || []

  // Calculate additional analytics
  const completedTests = tests.filter((t: any) => t.status === 'completed')
  const totalRequests = completedTests.reduce((sum: number, t: any) => sum + t.totalRequests, 0)
  const avgConcurrentUsers = completedTests.length > 0
    ? completedTests.reduce((sum: number, t: any) => sum + t.concurrentUsers, 0) / completedTests.length
    : 0

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
            <p className="text-gray-600 mt-1">Overview of your testing performance</p>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Tests"
              value={stats.totalTests || 0}
              icon={<ChartBarIcon className="h-8 w-8" />}
              color="blue"
            />
            <StatsCard
              title="Completed"
              value={stats.completedTests || 0}
              icon={<CheckCircleIcon className="h-8 w-8" />}
              color="green"
              subtitle={`${stats.successRate?.toFixed(1) || 0}% success rate`}
            />
            <StatsCard
              title="Running"
              value={stats.runningTests || 0}
              icon={<ClockIcon className="h-8 w-8" />}
              color="yellow"
            />
            <StatsCard
              title="Failed"
              value={stats.failedTests || 0}
              icon={<XCircleIcon className="h-8 w-8" />}
              color="red"
            />
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <h2 className="text-xl font-semibold mb-4">Performance Overview</h2>
              <div className="space-y-4">
                <MetricRow
                  label="Total Requests Executed"
                  value={totalRequests.toLocaleString()}
                  icon={<BoltIcon className="h-5 w-5 text-primary-600" />}
                />
                <MetricRow
                  label="Average Concurrent Users"
                  value={avgConcurrentUsers.toFixed(0)}
                  icon={<ChartBarIcon className="h-5 w-5 text-primary-600" />}
                />
                <MetricRow
                  label="Success Rate"
                  value={`${stats.successRate?.toFixed(1) || 0}%`}
                  icon={<CheckCircleIcon className="h-5 w-5 text-success-600" />}
                />
              </div>
            </Card>

            <Card>
              <h2 className="text-xl font-semibold mb-4">Test Distribution</h2>
              <div className="space-y-3">
                <DistributionBar
                  label="Completed"
                  value={stats.completedTests || 0}
                  total={stats.totalTests || 1}
                  color="bg-success-500"
                />
                <DistributionBar
                  label="Running"
                  value={stats.runningTests || 0}
                  total={stats.totalTests || 1}
                  color="bg-warning-500"
                />
                <DistributionBar
                  label="Failed"
                  value={stats.failedTests || 0}
                  total={stats.totalTests || 1}
                  color="bg-danger-500"
                />
                <DistributionBar
                  label="Pending"
                  value={(stats.totalTests || 0) - (stats.completedTests || 0) - (stats.runningTests || 0) - (stats.failedTests || 0)}
                  total={stats.totalTests || 1}
                  color="bg-gray-400"
                />
              </div>
            </Card>
          </div>

          {/* Recent Tests Table */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>
            {tests.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No tests yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Target
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        RPS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tests.slice(0, 10).map((test: any) => (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {test.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(test.status)}`}>
                            {test.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                          {test.targetUrl}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.concurrentUsers}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {test.requestsPerSecond}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </>
  )
}

function StatsCard({ title, value, icon, color, subtitle }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'text-primary-600 bg-primary-50',
    green: 'text-success-600 bg-success-50',
    yellow: 'text-warning-600 bg-warning-50',
    red: 'text-danger-600 bg-danger-50',
  }

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

function MetricRow({ label, value, icon }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        {icon}
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <span className="text-lg font-bold text-gray-900">{value}</span>
    </div>
  )
}

function DistributionBar({ label, value, total, color }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700">{label}</span>
        <span className="font-medium text-gray-900">{value}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    queued: 'bg-primary-100 text-primary-800',
    running: 'bg-warning-100 text-warning-800',
    completed: 'bg-success-100 text-success-800',
    failed: 'bg-danger-100 text-danger-800',
    cancelled: 'bg-gray-100 text-gray-800',
  }
  return colors[status] || colors.pending
}

