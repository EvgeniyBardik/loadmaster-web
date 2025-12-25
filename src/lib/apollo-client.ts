import { ApolloClient, InMemoryCache, HttpLink, split, ApolloLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

// Auth link to add JWT token to headers
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth-storage') : null
  
  let parsedToken = null
  if (token) {
    try {
      const parsed = JSON.parse(token)
      parsedToken = parsed.state?.token
    } catch (e) {
      console.error('Error parsing token:', e)
    }
  }

  return {
    headers: {
      ...headers,
      authorization: parsedToken ? `Bearer ${parsedToken}` : '',
    },
  }
})

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql',
  credentials: 'same-origin',
})

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
        createClient({
          url: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4000/graphql',
        })
      )
    : null

// Combine auth link with http link
const authedHttpLink = authLink.concat(httpLink)

const splitLink =
  typeof window !== 'undefined' && wsLink
    ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
          )
        },
        wsLink,
        authedHttpLink
      )
    : authedHttpLink

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
})

