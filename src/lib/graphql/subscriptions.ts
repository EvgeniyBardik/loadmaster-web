import { gql } from '@apollo/client'

export const LOAD_TEST_UPDATED = gql`
  subscription LoadTestUpdated($userId: String!) {
    loadTestUpdated(userId: $userId) {
      id
      status
      startedAt
      completedAt
    }
  }
`

