import { Requester, Validator } from '@chainlink/ea-bootstrap'
import { ExecuteWithConfig, InputParameters } from '@chainlink/ea-bootstrap'
import { NAME as AdapterName, Config } from '../config'
import { ethers, BigNumber } from 'ethers'
import { Decimal } from 'decimal.js'

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

  const jobRunID = validator.validated.id
  const { address: from, decimals: fromDecimals } = await getTokenDetails(validator, 'from', config)
  const { address: to, decimals: toDecimals } = await getTokenDetails(validator, 'to', config)
  const inputAmount = validator.validated.data.amount || 1
  const amount = BigNumber.from(inputAmount).mul(BigNumber.from(10).pow(fromDecimals))
  const resultPath = validator.validated.data.resultPath

  const feeTiers = validator.validated.data.feeTiers || config.feeTiers
  const output = await getBestRate(from, to, amount, feeTiers, config)

  if (output.eq(0)) {
    throw new Error('Quoted output was zero. This pool or fee tier may not exist')
  }

  const outputAmount = new Decimal(output.toString()).div(new Decimal(10).pow(toDecimals))
  const rate = outputAmount.div(inputAmount)

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
