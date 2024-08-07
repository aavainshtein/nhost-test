import { ApolloClient /*, createHttpLink */ } from '@apollo/client/core'
import type { ApolloClientOptions } from '@apollo/client/core'
import { createHttpLink, InMemoryCache } from '@apollo/client/core'
import { setContext } from '@apollo/client/link/context'

import { ApolloClients, provideApolloClients } from '@vue/apollo-composable'
import { createApolloClient } from '@nhost/apollo'
import { boot } from 'quasar/wrappers'
import { nhost } from './nhost'
// import { nhost } from '@nhost/nhost-js'

console.log('aaaaaaaaaaaaaaaaaaaaa', nhost.graphql._url)
const nhostGraphqlUrl = nhost.graphql._url

/* async */ function getClientOptions() {
  /* {app, router, ...} */ /* options?: Partial<BootFileParams<any>>,  */

  const httpLink = createHttpLink({
    uri: nhostGraphqlUrl,
  })

  const authLink = setContext((_, { headers }) => {
    const token = nhost.auth.getAccessToken()
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

export default boot(
  /* async */ ({ app }) => {
    const options = /* await */ getClientOptions(/* {app, router ...} */)
    const apolloClient = new ApolloClient(options)

    // Default client.
    // const apolloClient = createApolloClient({ nhostGraphql })
    // console.log('client', apolloClient)
    // // Additional client `clientA`
    // const optionsA = { ...options }
    // // Modify options as needed.
    // optionsA.link = createHttpLink({ uri: 'http://clientA.example.com' })
    // const clientA = new ApolloClient(optionsA)
    // // Additional client `clientB`
    // const optionsB = { ...options }
    // // Modify options as needed.
    // optionsB.link = createHttpLink({ uri: 'http://clientB.example.com' })
    // const clientB = new ApolloClient(optionsB)
    const apolloClients: Record<string, ApolloClient<unknown>> = {
      default: apolloClient,
      // clientA,
      // clientB,
    }
    app.provide(ApolloClients, provideApolloClients(apolloClients))
  },
)
