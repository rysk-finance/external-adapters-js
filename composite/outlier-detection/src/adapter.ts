import { AdapterRequest, AdapterResponse, Execute } from '@chainlink/types'
import { Requester, Validator } from '@chainlink/external-adapter'
import { getSourceImpl } from './source'
import { getLatestAnswer } from '@chainlink/reference-data-reader'
import { getCheckImpl } from './check'
import { Config, makeConfig } from './config'

const customParams = {
  referenceContract: ['referenceContract', 'contract'],
  multiply: true,
}

export const makeExecute = (config?: Config): Execute => {
  return async (request: AdapterRequest) => execute(request, config || makeConfig())
}

const execute = async (input: AdapterRequest, config: Config): Promise<AdapterResponse> => {
  const sourceExecute = config.sourceDataProviders.map(getSourceImpl)
  if (sourceExecute.length === 0) {
    throw Error('No source adapters provided')
  }
  const checkExecute = config.checkDataProviders.map(getCheckImpl)
  return await executeWithAdapters(input, sourceExecute, checkExecute, config)
}

export const executeWithAdapters = async (
  input: AdapterRequest,
  sources: Execute[],
  checks: Execute[],
  config: Config,
): Promise<AdapterResponse> => {
  const validator = new Validator(input, customParams)
  if (validator.error) throw validator.error

  if (!config.threshold) {
    throw new Error('config is missing threshold values')
  }

  const jobRunID = validator.validated.id
  const { referenceContract,  multiply } = validator.validated.data

  const onchainValue = await getLatestAnswer(referenceContract, multiply, input.meta)


  if (config.threshold.onchain > 0) {
    if (sources.length === 0) {
      throw Error('No source adapters provided')
    }
    
    const sourceMedian = await getExecuteMedian(sources, input)
    if (difference(sourceMedian, onchainValue) > config.threshold.onchain) {
      return returnValue(jobRunID, onchainValue)
    }
  }

  if (config.threshold.checks > 0) {
    if (checks.length === 0) {
      throw Error('No check adapters provided')
    }

    const checkMedian = await getExecuteMedian(checks, input)
    if (difference(sourceMedian, checkMedian) > config.threshold.checks) {
      return returnValue(jobRunID, onchainValue)
    }
  }

  return returnValue(jobRunID, sourceMedian)
}

const getExecuteMedian = async (executes: Execute[], request: AdapterRequest): Promise<number> => {
  const responses = await Promise.allSettled(executes.map((execute) => execute(request)))
  const values = responses
    .filter((result) => result.status === 'fulfilled' && 'value' in result)
    .map((result) => (result as PromiseFulfilledResult<AdapterResponse>).value.result)
  if (values.length === 0) throw Error('Unable to fetch value from any of the data providers')
  return median(values)
}

const median = (values: number[]): number => {
  if (values.length === 0) return 0
  values.sort((a, b) => a - b)
  const half = Math.floor(values.length / 2)
  if (values.length % 2) return values[half]
  return (values[half - 1] + values[half]) / 2.0
}

const difference = (a: number, b: number): number => {
  return (Math.abs(a - b) / ((a + b) / 2)) * 100
}

const returnValue = (jobRunID: string, result: number): AdapterResponse => {
  const response = { data: { result }, result, status: 200 }
  return Requester.success(jobRunID, response)
}
