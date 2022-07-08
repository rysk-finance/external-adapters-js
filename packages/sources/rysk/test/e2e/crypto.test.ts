import 'dotenv/config'
import { Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/ea-bootstrap'
import { makeExecute } from '../../src/adapter'
import { ENV_ETHEREUM_RPC_URL } from '../../src/config'
import * as process from 'process'

const id = '1'
describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()
  process.env[ENV_ETHEREUM_RPC_URL] = process.env[ENV_ETHEREUM_RPC_URL] || 'http://localhost:8546/'

  describe('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      {
        name: 'strike not supplied',
        testData: {
          id: jobID,
          data: { underlyingAsset: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
        },
      },
      {
        name: 'underlying not supplied',
        testData: {
          id: jobID,
          data: { underlyingAsset: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984' },
        },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest, {})
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })

  describe('endpoint testing', () => {
    const data: AdapterRequest = {
      id,
      data: {
        underlyingAsset: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', // WETH
        strikeAsset: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // USDC
        protocolAddress: '0x0',
      },
    }

    it('should request data using real endpoint', async () => {
      const jobID = '1'
      const execute = makeExecute()
      try {
        const res = await execute(data as AdapterRequest, {})
        console.log({ res })
      } catch (error) {
        const errorResp = Requester.errored(jobID, error)
        assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
      }
    })
  })
})
