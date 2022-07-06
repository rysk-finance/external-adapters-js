import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, InputParameters } from '@chainlink/ea-bootstrap'
import { NAME as AdapterName, Config } from '../config'
import Protocol from '../abis/Protocol.json'
import OptionRegistry from '../abis/OptionRegistry.json'
import { Protocol as IProtocol } from '../types/Protocol'
import PriceFeed from '../abis/PriceFeed.json'
import AddressBookInterface from '../abis/AddressBookInterface.json'
import LiquidityPool from '../abis/LiquidityPool.json'
import Oracle from '../abis/Oracle.json'
import { Oracle as IOracle } from '../types/Oracle'
import NewController from '../abis/NewController.json'
import { NewController as INewController } from '../types/NewController'
import { OptionRegistry as IOptionRegistry } from '../types/OptionRegistry'
import { LiquidityPool as ILiquidityPool } from '../types/LiquidityPool'
import { PriceFeed as IPriceFeed } from '../types/PriceFeed'
import { AddressBookInterface as IAddressBook } from '../types/AddressBookInterface'
import { ethers } from 'ethers'

export const description = 'Computes greeks and the value of calls and puts in a liquidity pool'

export const supportedEndpoints = ['crypto']

export const endpointResultPaths = {
  crypto: 'portfolio values',
}

export interface ResponseSchema {
  strikeAsset: string
  underlyingAsset: string
  // outputs are:
  portfolioDelta: number
  portfolioGamma: number
  portfolioTheta: number
  portfolioVega: number
  callsPutsValue: number
}

export type TInputParameters = {
  strikeAsset: string
  underlyingAsset: string
  protocolAddress: string
}
export const inputParameters: InputParameters<TInputParameters> = {
  strikeAsset: {
    aliases: ['strike'],
    required: true,
    description: 'The strike asset of the liquidity pool',
    type: 'string',
  },
  underlyingAsset: {
    aliases: ['underlying'],
    required: true,
    description: 'The underlying asset of the liquidity pool',
    type: 'string',
  },
  protocolAddress: {
    aliases: ['protocol'],
    required: true,
    description: 'The address of the protocol contract',
    type: 'string',
  },
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParameters)
  const resultPath = validator.validated.data.resultPath

  const jobRunID = validator.validated.id
  const strikeAsset = validator.validated.data.strikeAsset
  const underlyingAsset = validator.validated.data.underlyingAsset
  const protocolAddress = validator.validated.data.protocolAddress
  const output = await fetchPortfolioValues(strikeAsset, underlyingAsset, protocolAddress, config)
  //const output = await getBestRate(from, to, amount, feeTiers, config)

  if (output.eq(0)) {
    throw new Error('Quoted output was zero. This pool or fee tier may not exist')
  }

  const data: ResponseSchema = {
    strikeAsset,
    underlyingAsset,
    inputDecimals: fromDecimals,
    output: output.toString(),
    outputToken: to,
    outputDecimals: toDecimals,
    rate: rate.toNumber(),
  }

  const response = {
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
    data: data,
  }
  const result = Requester.validateResultNumber(response.data, resultPath)

  return Requester.success(jobRunID, Requester.withResult(response, result), config.verbose)
}

const fetchPortfolioValues = async (config: Config) => {
  const protocolContract = new ethers.Contract(
    config.protocolAddress,
    Protocol.abi,
    config.provider,
  ) as IProtocol
  const optionRegistryAddress = await protocolContract.optionRegistry()
  const priceFeedAddress = await protocolContract.priceFeed()
  const optionRegistryContract = new ethers.Contract(
    optionRegistryAddress,
    OptionRegistry.abi,
    config.provider,
  ) as IOptionRegistry
  const priceFeedContract = new ethers.Contract(
    priceFeedAddress,
    PriceFeed.abi,
    config.provider,
  ) as IPriceFeed
  const liquidityPoolAddress = await optionRegistryContract.liquidityPool()
  const liquidityPoolContract = new ethers.Contract(
    liquidityPoolAddress,
    LiquidityPool.abi,
    config.provider,
  ) as ILiquidityPool
  const poolUnderlying = await liquidityPoolContract.underlyingAsset()
  const poolStrike = await liquidityPoolContract.strikeAsset()
  if (poolUnderlying !== config.underlyingAsset) throw new Error('Underlying asset mismatch')
  if (poolStrike !== config.strikeAsset) throw new Error('Strike asset mismatch')
  const addressBookAddress = await optionRegistryContract.addressBook()
  const addressBookContract = new ethers.Contract(
    addressBookAddress,
    AddressBookInterface.abi,
    config.provider,
  ) as IAddressBook
  const oracleAddress = await addressBookContract.getOracle()
  const controllerAddress = await addressBookContract.getController()
  const oracleContract = new ethers.Contract(oracleAddress, Oracle.abi, config.provider) as IOracle
  const controllerContract = new ethers.Contract(
    controllerAddress,
    NewController.abi,
    config.provider,
  ) as INewController
}
