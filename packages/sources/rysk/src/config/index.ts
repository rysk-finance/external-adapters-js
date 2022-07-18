import { Requester, util } from '@chainlink/ea-bootstrap'
import { Config as BaseConfig } from '@chainlink/ea-bootstrap'
import { ethers } from 'ethers'

export const NAME = 'RYSK DYNAMIC HEDGING'

export const ENV_ETHEREUM_RPC_URL = 'ETHEREUM_RPC_URL'
export const ENV_FALLBACK_RPC_URL = 'RPC_URL'
export const ENV_BLOCKCHAIN_NETWORK = 'BLOCKCHAIN_NETWORK'
export const ENV_PROTOCOL_CONTRACT = 'PROTOCOL_CONTRACT'
export const ENV_FEE_TIERS = 'DEFAULT_FEE_TIERS'

export const DEFAULT_ENDPOINT = 'crypto'
export const DEFAULT_BLOCKCHAIN_NETWORK = 'arbitrum'

export const DEFAULT_PROTOCOL_CONTRACT = '0xeF31027350Be2c7439C1b0BE022d49421488b72C'
export const VERBOSE_RESPONSE = true

export type Config = BaseConfig & {
  defaultEndpoint: string
  provider: ethers.providers.Provider
  network: string
  protocolAddress: string
  verbose: boolean
}

export const makeConfig = (prefix: string | undefined): Config => {
  return {
    ...Requester.getDefaultConfig(prefix),
    defaultEndpoint: DEFAULT_ENDPOINT,
    provider: new ethers.providers.JsonRpcProvider(
      util.getRequiredEnvWithFallback(ENV_ETHEREUM_RPC_URL, [ENV_FALLBACK_RPC_URL], prefix),
    ),
    network: util.getEnv(ENV_BLOCKCHAIN_NETWORK, prefix) || DEFAULT_BLOCKCHAIN_NETWORK,
    protocolAddress: util.getEnv(ENV_PROTOCOL_CONTRACT, prefix) || DEFAULT_PROTOCOL_CONTRACT,
    verbose: VERBOSE_RESPONSE,
  }
}
