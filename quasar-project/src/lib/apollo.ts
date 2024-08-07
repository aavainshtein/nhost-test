import type { ApolloClientOptions } from '@apollo/client/core'
import { createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'
// import type { BootFileParams } from '@quasar/app-vite'
import { nhost } from 'src/boot/nhost'

const HASURA_GRAPHQL_ENDPOINT = process.env.HASURA_GRAPHQL_ENDPOINT

export /* async */ function getClientOptions() {
  /* {app, router, ...} */ /* options?: Partial<BootFileParams<any>>,  */

  const httpLink = createHttpLink({
    uri: `${HASURA_GRAPHQL_ENDPOINT}/v1/graphql`,
  })

  const hasuraAuthClient = nhost.auth
  const authLink = setContext((_, { headers }) => {
    const token = hasuraAuthClient?.getAccessToken()

    return {
      headers: {
        ...headers,
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
    }
  })

  const link = authLink.concat(httpLink)

  return <ApolloClientOptions<unknown>>Object.assign(
    // General options.
    <ApolloClientOptions<unknown>>{
      link,
      cache: new InMemoryCache(),
    },

    // Specific Quasar mode options.
    process.env.MODE === 'spa' ? {} : {},
    process.env.MODE === 'ssr' ? {} : {},
    process.env.MODE === 'pwa' ? {} : {},
    process.env.MODE === 'bex' ? {} : {},
    process.env.MODE === 'cordova' ? {} : {},
    process.env.MODE === 'capacitor' ? {} : {},
    process.env.MODE === 'electron' ? {} : {},

    // dev/prod options.
    process.env.DEV ? {} : {},
    process.env.PROD ? {} : {},

    // For ssr mode, when on server.
    process.env.MODE === 'ssr' && process.env.SERVER ? { ssrMode: true } : {},
    // For ssr mode, when on client.
    process.env.MODE === 'ssr' && process.env.CLIENT
      ? { ssrForceFetchDelay: 100 }
      : {},
  )
}
