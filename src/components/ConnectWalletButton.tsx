import { useState } from 'react'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useChainId,
  useSwitchChain,
} from 'wagmi'
import { Button } from './Button'
import { Toast } from './Toast'
import { ALL_CHAINS } from '../config/wagmi'

export const ConnectWalletButton = () => {
  const { address, isConnected, connector } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [showToast, setShowToast] = useState(false)

  const formatAddress = (addr: string | null) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const sequenceConnector = connectors.find(c => c.id === 'sequence')
  const metaMaskConnector =
    connectors.find(
      c =>
        c.id !== 'sequence' &&
        (c.id === 'io.metamask' ||
          c.id === 'metaMaskSDK' ||
          c.name?.toLowerCase().includes('metamask') ||
          c.name === 'MetaMask' ||
          (c.id && c.id.includes('meta'))),
    ) ||
    connectors.find(c => c.id !== 'sequence' && !c.id?.includes('sequence'))

  const handleConnect = (
    connector?: typeof sequenceConnector | typeof metaMaskConnector,
  ) => {
    if (connector) {
      connect({ connector })
    }
  }

  const handleDisconnect = () => {
    if (connector) {
      disconnect({ connector })
    } else {
      disconnect()
    }
  }

  const handleCopyAddress = async () => {
    if (address) {
      try {
        await navigator.clipboard.writeText(address)
        setShowToast(true)
      } catch {
        // Fallback for older browsers
        const textArea = document.createElement('textarea')
        textArea.value = address
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
          setShowToast(true)
        } catch (fallbackErr) {
          console.error('Failed to copy address:', fallbackErr)
        }
        document.body.removeChild(textArea)
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      {showToast && (
        <Toast message="Address copied!" onClose={() => setShowToast(false)} />
      )}
      {isConnected && address ? (
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-2 text-retro-text-muted text-sm">
            Connected:{' '}
            <span className="text-retro-secondary font-mono">
              {formatAddress(address)}
            </span>
            <button
              onClick={handleCopyAddress}
              className="text-retro-secondary hover:text-retro-accent transition-colors cursor-pointer"
              aria-label="Copy address"
            >
              📋
            </button>
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
              onChange={async e => {
                const newChainId = parseInt(e.target.value)
                if (newChainId !== chainId) {
                  try {
                    await switchChain({ chainId: newChainId })
                  } catch {
                    // Silently handle chain switch errors (user may reject the prompt)
                  }
                }
              }}
              disabled={isSwitchingChain}
              className="w-full bg-retro-surface border-4 border-retro-accent text-retro-accent px-4 py-2 font-bold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-retro-accent focus:ring-offset-2 focus:ring-offset-retro-bg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="text-retro-text-muted text-sm uppercase tracking-wider mb-2">
            Connect Wallet
          </div>
          <div className="flex flex-row gap-3 w-full max-w-xs justify-center">
            {metaMaskConnector && (
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleConnect(metaMaskConnector)}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? 'Connecting...' : 'MetaMask'}
              </Button>
            )}
            {sequenceConnector && (
              <Button
                variant="secondary"
                size="lg"
                onClick={() => handleConnect(sequenceConnector)}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? 'Connecting...' : 'Sequence'}
              </Button>
            )}
            {!metaMaskConnector && !sequenceConnector && (
              <div className="text-red-400 text-sm text-center max-w-md">
                No wallet connectors available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
