'use client'

import { useState } from 'react'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { CREATE_LOAD_TEST } from '@/lib/graphql/mutations'
import { GET_LOAD_TESTS } from '@/lib/graphql/queries'
import { Navbar } from '@/components/layout/Navbar'
import { Card } from '@/components/common/Card'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'

export default function NewTestPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    targetUrl: '',
    method: 'GET',
    concurrentUsers: 10,
    totalRequests: 100,
    durationSeconds: 60,
    requestsPerSecond: 10,
  })

  const [createTest, { loading, error }] = useMutation(CREATE_LOAD_TEST, {
    refetchQueries: [{ query: GET_LOAD_TESTS }],
    onCompleted: (data) => {
      router.push(`/tests/${data.createLoadTest.id}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createTest({
      variables: { input: formData },
    })
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Load Test</h1>
            <p className="text-gray-600 mb-8">Configure your load test parameters</p>

            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-danger-50 text-danger-700 p-3 rounded-lg text-sm">
                    {error.message}
                  </div>
                )}

                <Input
                  label="Test Name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="My API Load Test"
                  required
                />

                <div>
                  <label className="label">Description (Optional)</label>
                  <textarea
                    className="input min-h-[100px]"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Test description..."
                  />
                </div>

                <Input
                  label="Target URL"
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => handleChange('targetUrl', e.target.value)}
                  placeholder="https://api.example.com/endpoint"
                  required
                />

                <div>
                  <label className="label">HTTP Method</label>
                  <select
                    className="input"
                    value={formData.method}
                    onChange={(e) => handleChange('method', e.target.value)}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                    <option value="PATCH">PATCH</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Concurrent Users"
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.concurrentUsers}
                    onChange={(e) => handleChange('concurrentUsers', parseInt(e.target.value))}
                    required
                  />

                  <Input
                    label="Requests Per Second"
                    type="number"
                    min="1"
                    max="10000"
                    value={formData.requestsPerSecond}
                    onChange={(e) =>
                      handleChange('requestsPerSecond', parseInt(e.target.value))
                    }
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Total Requests"
                    type="number"
                    min="1"
                    value={formData.totalRequests}
                    onChange={(e) => handleChange('totalRequests', parseInt(e.target.value))}
                    required
                  />

                  <Input
                    label="Duration (seconds)"
                    type="number"
                    min="1"
                    max="3600"
                    value={formData.durationSeconds}
                    onChange={(e) => handleChange('durationSeconds', parseInt(e.target.value))}
                    required
                  />
                </div>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-medium text-primary-900 mb-2">Test Configuration</h3>
                  <ul className="text-sm text-primary-700 space-y-1">
                    <li>• {formData.concurrentUsers} concurrent users</li>
                    <li>• {formData.requestsPerSecond} requests per second</li>
                    <li>• {formData.totalRequests} total requests</li>
                    <li>• {formData.durationSeconds} seconds duration</li>
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <Button type="submit" loading={loading} className="flex-1">
                    Create Test
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}

