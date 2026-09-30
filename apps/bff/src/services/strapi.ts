import { GraphQLClient } from 'graphql-request'

const strapiUrl = process.env.STRAPI_GRAPHQL_URL
const strapiToken = process.env.STRAPI_API_TOKEN

if (!strapiUrl || !strapiToken) {
  throw new Error(
    'STRAPI_GRAPHQL_URL and STRAPI_API_TOKEN environment variables are required'
  )
}

export const strapiClient = new GraphQLClient(strapiUrl, {
  headers: {
    Authorization: `Bearer ${strapiToken}`,
  },
})

// Helper to make authenticated requests to Strapi
export async function queryStrapiGraphQL<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  try {
    const data = await strapiClient.request<T>(query, variables)
    return data
  } catch (error) {
    console.error('Strapi GraphQL Error:', error)
    throw new Error(`Failed to query Strapi: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
