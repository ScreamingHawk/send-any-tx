import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { Button } from './Button'
import { ALL_CHAINS } from '../config/wagmi'

export const ConnectWalletButton = () => {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  const formatAddress = (addr: string | null) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const sequenceConnector = connectors.find(c => c.id === 'sequence')

  const handleConnect = () => {
    if (sequenceConnector) {
      connect({ connector: sequenceConnector })
    }
  }

  const handleDisconnect = () => {
    if (connector) {
      disconnect({ connector })
    } else {
      disconnect()
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {isConnected && address ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="text-retro-text-muted text-sm">
            Connected:{' '}
            <span className="text-retro-secondary font-mono">
              {formatAddress(address)}
            </span>
          </div>
          <Button variant="secondary" size="lg" onClick={handleDisconnect}>
            Disconnect
          </Button>
          <div className="flex flex-col items-center gap-3 w-full max-w-xs">
            <label className="text-retro-text-muted text-sm uppercase tracking-wider">
              Network
            </label>
            <select
              value={chainId}
              onChange={e => {
                const newChainId = parseInt(e.target.value)
                if (newChainId !== chainId) {
                  switchChain({ chainId: newChainId })
                }
              }}
              className="w-full bg-retro-surface border-4 border-retro-accent text-retro-accent px-4 py-2 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-retro-accent focus:ring-offset-2 focus:ring-offset-retro-bg cursor-pointer"
            >
              {ALL_CHAINS.map(chain => (
                <option
                  key={chain.id}
                  value={chain.id}
                  className="bg-retro-surface text-retro-accent"
                >
                  {chain.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="primary"
            size="lg"
            onClick={handleConnect}
            disabled={isPending || !sequenceConnector}
          >
            {isPending ? 'Connecting...' : 'Connect Sequence Wallet'}
          </Button>
          {!sequenceConnector && (
            <div className="text-red-400 text-sm text-center max-w-md">
              Sequence connector not available
            </div>
          )}
        </div>
      )}
    </div>
  )
}
