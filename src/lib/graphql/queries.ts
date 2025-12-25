import { gql } from '@apollo/client'

export const GET_LOAD_TESTS = gql`
  query GetLoadTests {
    loadTests {
      id
      name
      description
      targetUrl
      method
      concurrentUsers
      totalRequests
      durationSeconds
      requestsPerSecond
      status
      startedAt
      completedAt
      createdAt
    }
  }
`

export const GET_LOAD_TEST = gql`
  query GetLoadTest($id: String!) {
    loadTest(id: $id) {
      id
      name
      description
      targetUrl
      method
      concurrentUsers
      totalRequests
      durationSeconds
      requestsPerSecond
      headers
      body
      status
      startedAt
      completedAt
      createdAt
      results {
        id
        totalRequests
        successfulRequests
        failedRequests
        averageResponseTime
        minResponseTime
        maxResponseTime
        p50ResponseTime
        p95ResponseTime
        p99ResponseTime
        requestsPerSecond
        errorRate
        statusCodeDistribution
        errorDistribution
        timeSeriesData
        createdAt
      }
    }
  }
`

export const GET_TEST_RESULTS = gql`
  query GetTestResults($testId: String!) {
    testResults(testId: $testId) {
      id
      totalRequests
      successfulRequests
      failedRequests
      averageResponseTime
      minResponseTime
      maxResponseTime
      p50ResponseTime
      p95ResponseTime
      p99ResponseTime
      requestsPerSecond
      errorRate
      statusCodeDistribution
      errorDistribution
      timeSeriesData
      createdAt
    }
  }
`

export const GET_LOAD_TEST_STATISTICS = gql`
  query GetLoadTestStatistics {
    loadTestStatistics {
      totalTests
      completedTests
      runningTests
      failedTests
      successRate
    }
  }
`

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      plan
      cloudEnabled
      createdAt
    }
  }
`

