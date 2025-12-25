'use client'

import { useQuery, useMutation } from '@apollo/client'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeftIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline'
import { GET_LOAD_TEST } from '@/lib/graphql/queries'
import { START_LOAD_TEST, STOP_LOAD_TEST } from '@/lib/graphql/mutations'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { StatusBadge } from '@/components/common/Badge'
import { formatDistanceToNow } from 'date-fns'

export default function TestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const testId = params.id as string

  const { data, loading, refetch } = useQuery(GET_LOAD_TEST, {
    variables: { id: testId },
    pollInterval: 3000, // Poll every 3 seconds for updates
  })

  const [startTest, { loading: starting }] = useMutation(START_LOAD_TEST, {
    onCompleted: () => refetch(),
  })

  const [stopTest, { loading: stopping }] = useMutation(STOP_LOAD_TEST, {
    onCompleted: () => refetch(),
  })

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading />
      </>
    )
  }

  const test = data?.loadTest
  if (!test) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <p className="text-center text-gray-600">Test not found</p>
          </Card>
        </div>
      </>
    )
  }

  const latestResult = test.results?.[0]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button onClick={() => router.back()} className="mr-4">
              <ArrowLeftIcon className="h-6 w-6 text-gray-600 hover:text-gray-900" />
            </button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{test.name}</h1>
              {test.description && (
                <p className="text-gray-600 mt-1">{test.description}</p>
              )}
            </div>
            <StatusBadge status={test.status} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Configuration */}
            <Card className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Configuration</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Target URL" value={test.targetUrl} />
                <InfoRow label="Method" value={test.method} />
                <InfoRow label="Concurrent Users" value={test.concurrentUsers} />
                <InfoRow label="Requests/Second" value={test.requestsPerSecond} />
                <InfoRow label="Total Requests" value={test.totalRequests} />
                <InfoRow label="Duration" value={`${test.durationSeconds}s`} />
                <InfoRow 
                  label="Created" 
                  value={formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })} 
                />
                {test.startedAt && (
                  <InfoRow 
                    label="Started" 
                    value={formatDistanceToNow(new Date(test.startedAt), { addSuffix: true })} 
                  />
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 flex space-x-4">
                {test.status === 'pending' && (
                  <Button
                    onClick={() => startTest({ variables: { id: testId } })}
                    loading={starting}
                    variant="success"
                  >
                    <PlayIcon className="h-5 w-5 mr-2 inline" />
                    Start Test
                  </Button>
                )}
                {(test.status === 'running' || test.status === 'queued') && (
                  <Button
                    onClick={() => stopTest({ variables: { id: testId } })}
                    loading={stopping}
                    variant="danger"
                  >
                    <StopIcon className="h-5 w-5 mr-2 inline" />
                    Stop Test
                  </Button>
                )}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card>
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              {latestResult ? (
                <div className="space-y-3">
                  <StatRow 
                    label="Total Requests" 
                    value={latestResult.totalRequests.toLocaleString()} 
                  />
                  <StatRow 
                    label="Successful" 
                    value={latestResult.successfulRequests.toLocaleString()} 
                    valueClass="text-success-600"
                  />
                  <StatRow 
                    label="Failed" 
                    value={latestResult.failedRequests.toLocaleString()} 
                    valueClass="text-danger-600"
                  />
                  <StatRow 
                    label="Avg Response" 
                    value={`${latestResult.averageResponseTime.toFixed(2)}ms`} 
                  />
                  <StatRow 
                    label="P95 Response" 
                    value={`${latestResult.p95ResponseTime.toFixed(2)}ms`} 
                  />
                  <StatRow 
                    label="Error Rate" 
                    value={`${latestResult.errorRate.toFixed(2)}%`} 
                    valueClass={latestResult.errorRate > 5 ? "text-danger-600" : "text-success-600"}
                  />
                  <StatRow 
                    label="RPS" 
                    value={latestResult.requestsPerSecond.toFixed(2)} 
                  />
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No results yet. Start the test to see metrics.</p>
              )}
            </Card>

            {/* Results */}
            {latestResult && (
              <Card className="lg:col-span-3">
                <h2 className="text-xl font-semibold mb-4">Detailed Results</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Min Response" value={`${latestResult.minResponseTime.toFixed(2)}ms`} />
                  <MetricCard label="Max Response" value={`${latestResult.maxResponseTime.toFixed(2)}ms`} />
                  <MetricCard label="P50 (Median)" value={`${latestResult.p50ResponseTime.toFixed(2)}ms`} />
                  <MetricCard label="P99" value={`${latestResult.p99ResponseTime.toFixed(2)}ms`} />
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

function InfoRow({ label, value }: { label: string; value: any }) {
  return (
    <div>
      <span className="text-sm text-gray-500">{label}</span>
      <p className="font-medium text-gray-900">{value}</p>
    </div>
  )
}

function StatRow({ label, value, valueClass = "text-gray-900" }: { label: string; value: any; valueClass?: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className={`font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

