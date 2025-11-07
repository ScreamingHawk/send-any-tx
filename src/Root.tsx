import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useMemo } from 'react'
import { getWagmiConfig } from './config/wagmi'
import App from './App'

const queryClient = new QueryClient()

function Root() {
  const config = useMemo(() => getWagmiConfig(), [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Root
