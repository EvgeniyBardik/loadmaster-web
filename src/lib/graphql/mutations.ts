import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        id
        email
        name
        plan
      }
      token
    }
  }
`

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        id
        email
        name
        plan
      }
      token
    }
  }
`

export const CREATE_LOAD_TEST = gql`
  mutation CreateLoadTest($input: CreateLoadTestInput!) {
    createLoadTest(input: $input) {
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
      createdAt
    }
  }
`

export const UPDATE_LOAD_TEST = gql`
  mutation UpdateLoadTest($id: String!, $input: UpdateLoadTestInput!) {
    updateLoadTest(id: $id, input: $input) {
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
    }
  }
`

export const DELETE_LOAD_TEST = gql`
  mutation DeleteLoadTest($id: String!) {
    deleteLoadTest(id: $id)
  }
`

export const START_LOAD_TEST = gql`
  mutation StartLoadTest($id: String!) {
    startLoadTest(id: $id) {
      id
      status
      startedAt
    }
  }
`

export const STOP_LOAD_TEST = gql`
  mutation StopLoadTest($id: String!) {
    stopLoadTest(id: $id) {
      id
      status
      completedAt
    }
  }
`

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($plan: String!) {
    updatePlan(plan: $plan) {
      id
      plan
      cloudEnabled
    }
  }
`

