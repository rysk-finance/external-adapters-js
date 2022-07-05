import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, InputParameters } from '@chainlink/ea-bootstrap'
import { NAME as AdapterName, Config } from '../config'
import Protocol from '../abis/Protocol.json'
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
}

export const execute: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParameters)
  const resultPath = validator.validated.data.resultPath

  const jobRunID = validator.validated.id
  const strikeAsset = validator.validated.data.strikeAsset
  const underlyingAsset = validator.validated.data.underlyingAsset
  const output = await fetchPortfolioValues(strikeAsset, underlyingAsset, config)
  //const output = await getBestRate(from, to, amount, feeTiers, config)

  if (output.eq(0)) {
    throw new Error('Quoted output was zero. This pool or fee tier may not exist')
  }

  const data: ResponseSchema = {
    input: amount.toString(),
    inputToken: from,
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

const fetchPortfolioValues = async (
  strikeAsset: string,
  underlyingAsset: string,
  config: Config,
) => {
  const protocolContract = new ethers.Contract(
    config.protocolAddress,
    Protocol.abi,
    config.provider,
  )
}
