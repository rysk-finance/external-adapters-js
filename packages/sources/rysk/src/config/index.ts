import { Requester, util } from '@chainlink/ea-bootstrap'
import { Config as BaseConfig, ConfigFactory } from '@chainlink/ea-bootstrap'
import { ethers } from 'ethers'

export const NAME = 'RYSK DYNAMIC HEDGING'

export const ENV_ETHEREUM_RPC_URL = 'ETHEREUM_RPC_URL'
export const ENV_FALLBACK_RPC_URL = 'RPC_URL'
export const ENV_BLOCKCHAIN_NETWORK = 'BLOCKCHAIN_NETWORK'
export const ENV_PROTOCOL_CONTRACT = 'PROTOCOL_CONTRACT'
export const ENV_FEE_TIERS = 'DEFAULT_FEE_TIERS'

export const DEFAULT_ENDPOINT = 'crypto'
export const DEFAULT_BLOCKCHAIN_NETWORK = 'arbitrum'

export const DEFAULT_PROTOCOL_CONTRACT = '0xFD2Cf3b56a73c75A7535fFe44EBABe7723c64719'

export type Config = BaseConfig & {
  provider: ethers.providers.Provider
  network: string
  underlyingAsset: string
  strikeAsset: string
  protocolAddress: string
}

export const makeConfig: ConfigFactory<Config> = (prefix: string | undefined) => {
  return {
    ...Requester.getDefaultConfig(prefix),
    defaultEndpoint: DEFAULT_ENDPOINT,
    provider: new ethers.providers.JsonRpcProvider(
      util.getRequiredEnvWithFallback(ENV_ETHEREUM_RPC_URL, [ENV_FALLBACK_RPC_URL], prefix),
    ),
    network: util.getEnv(ENV_BLOCKCHAIN_NETWORK, prefix) || DEFAULT_BLOCKCHAIN_NETWORK,
    protocolAddress: util.getEnv(ENV_PROTOCOL_CONTRACT, prefix) || DEFAULT_PROTOCOL_CONTRACT,
  }
}
