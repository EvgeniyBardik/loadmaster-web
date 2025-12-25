'use client'

import { useQuery, useMutation } from '@apollo/client'
import Link from 'next/link'
import { PlusIcon, PlayIcon, TrashIcon } from '@heroicons/react/24/outline'
import { GET_LOAD_TESTS } from '@/lib/graphql/queries'
import { DELETE_LOAD_TEST, START_LOAD_TEST } from '@/lib/graphql/mutations'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Loading } from '@/components/common/Loading'
import { StatusBadge } from '@/components/common/Badge'
import { formatDistanceToNow } from 'date-fns'

export default function TestsPage() {
  const { data, loading, refetch } = useQuery(GET_LOAD_TESTS)
  const [deleteTest] = useMutation(DELETE_LOAD_TEST, {
    onCompleted: () => refetch(),
  })
  const [startTest] = useMutation(START_LOAD_TEST, {
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

  const tests = data?.loadTests || []

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this test?')) {
      await deleteTest({ variables: { id } })
    }
  }

  const handleStart = async (id: string) => {
    await startTest({ variables: { id } })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Load Tests</h1>
              <p className="text-gray-600 mt-1">Manage and run your load tests</p>
            </div>
            <Link href="/tests/new">
              <Button>
                <PlusIcon className="h-5 w-5 mr-2 inline" />
                New Test
              </Button>
            </Link>
          </div>

          {/* Tests Grid */}
          {tests.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No load tests yet</p>
                <Link href="/tests/new">
                  <Button>Create Your First Test</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tests.map((test: any) => (
                <Card key={test.id} className="hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <Link href={`/tests/${test.id}`}>
                        <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600 cursor-pointer">
                          {test.name}
                        </h3>
                      </Link>
                      {test.description && (
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                      )}
                    </div>
                    <StatusBadge status={test.status} />
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Target:</span>
                      <span className="truncate ml-2">{test.targetUrl}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Method:</span>
                      <span className="font-mono">{test.method}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Users:</span>
                      <span>{test.concurrentUsers}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">RPS:</span>
                      <span>{test.requestsPerSecond}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>{test.durationSeconds}s</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Created {formatDistanceToNow(new Date(test.createdAt), { addSuffix: true })}
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/tests/${test.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    {test.status === 'pending' && (
                      <Button
                        variant="success"
                        onClick={() => handleStart(test.id)}
                        className="flex-1"
                      >
                        <PlayIcon className="h-4 w-4 mr-1 inline" />
                        Start
                      </Button>
                    )}
                    {(test.status === 'pending' || test.status === 'completed' || test.status === 'failed') && (
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(test.id)}
                        className="px-3"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

