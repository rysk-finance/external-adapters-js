import { BigNumber } from 'ethers'

import { Config, ExecuteWithConfig, ExecuteFactory, InputParameters } from '@chainlink/ea-bootstrap'
import { Requester, Validator, AdapterError } from '@chainlink/ea-bootstrap'

import { makeConfig } from './config'

// We're on localhost, so retries just confuse the oracle state.
const NUM_RETRIES = 1

export interface Action {
  type: string
  data: unknown
}

export type TInputParameters = { request_id: string; result: string; payment: string }
export const inputParams: InputParameters<TInputParameters> = {
  request_id: {
    type: 'string',
    required: true,
  },
  result: {
    type: 'string',
    required: true,
  },
  payment: {
    type: 'string',
    required: true,
  },
}

// Convert the payment in $LINK into Agoric's pegged $LINK token.
export const getRequiredFee = (value: string | number): string => {
  const paymentCL = BigNumber.from(value)
  return paymentCL.toString()
}

export interface PostReply {
  ok: boolean
  res?: unknown
  rej?: unknown
}

const executeImpl: ExecuteWithConfig<Config> = async (request, _, config) => {
  const validator = new Validator(request, inputParams)

  Requester.logConfig(config)

  const jobRunID = validator.validated.id
  const { request_id: queryId, result, payment } = validator.validated.data
  const requiredFee = getRequiredFee(payment)

  const obj = {
    type: 'oracleServer/reply',
    data: { queryId, reply: result, requiredFee },
  }

  const response = await Requester.request(
    {
      ...config.api,
      method: 'POST',
      data: obj,
    },
    undefined,
    NUM_RETRIES,
  )

  const pr = response.data as PostReply
  if (!pr.ok) {
    throw Error(`${obj.type} response failed: ${pr.rej}`)
  }

  return Requester.success(jobRunID, {
    data: { result },
    status: 200,
  })
}

const tryExecuteLogError =
  (execute: ExecuteWithConfig<Config>): ExecuteWithConfig<Config> =>
  async (request, context, config) => {
    try {
      return await execute(request, context, config)
    } catch (e) {
      const error = e as Error
      const queryId = request.data?.request_id
      const rest = { queryId }

      await Requester.request(
        {
          ...config.api,
          method: 'POST',
          data: {
            type: 'oracleServer/error',
            data: { error: `${(error && error.message) || error}`, ...(queryId && rest) },
          },
        },
        undefined,
        NUM_RETRIES,
      ).catch((e2: Error) => console.error(`Cannot reflect error to caller:`, e2))

      // See https://github.com/smartcontractkit/external-adapters-js/issues/204
      // for discussion of why this code is necessary.
      if (e instanceof AdapterError) {
        throw e
      }
      throw new AdapterError({
        jobRunID: request.id,
        statusCode: 500,
        message: `${(error && error.message) || error}`,
        cause: error,
      })
    }
  }

export const execute = tryExecuteLogError(executeImpl)
export const makeExecute: ExecuteFactory<Config, TInputParameters> = (config) => {
  return async (request, context) => execute(request, context, config || makeConfig())
}
