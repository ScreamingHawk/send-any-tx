import { createConfig, http, type CreateConnectorFn } from 'wagmi'
import {
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  gnosis,
  zkSync,
  zkSyncSepoliaTestnet,
  linea,
  lineaSepolia,
  scroll,
  scrollSepolia,
  zetachain,
  zetachainAthensTestnet,
  blast,
  blastSepolia,
  mode,
} from 'wagmi/chains'
import { sequence, type Wallet } from '@0xsequence/connect'
import { WALLET_CONFIG } from './wallet'
import type { Chain } from 'wagmi/chains'

const getConnectWallets = (
  projectAccessKey: string,
  wallets: Wallet[],
): CreateConnectorFn[] => {
  const connectors: CreateConnectorFn[] = []

  wallets.forEach(wallet => {
    const { createConnector, id } = wallet

    const createConnectorOverride: CreateConnectorFn = config => {
      const connector = createConnector(projectAccessKey)
      const connectorInstance = connector(config)

      Object.defineProperty(connectorInstance, 'id', {
        value: id,
        writable: false,
        enumerable: true,
        configurable: true,
      })

      return connectorInstance
    }

    connectors.push(createConnectorOverride)
  })

  return connectors
}

export const ALL_CHAINS: Chain[] = [
  mainnet,
  sepolia,
  polygon,
  polygonMumbai,
  arbitrum,
  arbitrumSepolia,
  optimism,
  optimismSepolia,
  base,
  baseSepolia,
  avalanche,
  avalancheFuji,
  bsc,
  bscTestnet,
  celo,
  celoAlfajores,
  gnosis,
  zkSync,
  zkSyncSepoliaTestnet,
  linea,
  lineaSepolia,
  scroll,
  scrollSepolia,
  zetachain,
  zetachainAthensTestnet,
  blast,
  blastSepolia,
  mode,
].sort((a, b) => a.name.localeCompare(b.name))

export const getWagmiConfig = () => {
  const projectAccessKey = WALLET_CONFIG.prod.projectAccessKey
  const walletAppURL = WALLET_CONFIG.prod.url
  const defaultNetwork = mainnet.id

  const wallet = sequence({
    walletAppURL,
    defaultNetwork,
    connect: {
      app: 'Send Any Tx',
    },
  })
  wallet.id = 'sequence'
  wallet.name = 'Sequence'

  const wallets: Wallet[] = [wallet]
  const connectors = getConnectWallets(projectAccessKey, wallets)

  const transports: Record<number, ReturnType<typeof http>> = {}
  ALL_CHAINS.forEach(chain => {
    transports[chain.id] = http()
  })

  return createConfig({
    chains: ALL_CHAINS as [Chain, ...Chain[]],
    connectors,
    transports,
  })
}
