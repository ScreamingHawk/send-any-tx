export const WALLET_CONFIG = {
  prod: {
    url: 'https://sequence.app',
    projectAccessKey: 'u9J7cMlURB9QrzZvBiQGEAKAAAAAAAAA',
  },
} as const

export const getWalletURL = (): string => {
  return WALLET_CONFIG.prod.url
}

export const getProjectAccessKey = (): string => {
  return WALLET_CONFIG.prod.projectAccessKey
}
