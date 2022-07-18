import * as dotenv from 'dotenv'
import { Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/ea-bootstrap'
import { makeExecute } from '../../src/adapter'
import { ENV_ETHEREUM_RPC_URL } from '../../src/config'
import * as process from 'process'
dotenv.config({ debug: true })

const dataKeys = [
  'strikeAsset',
  'underlyingAsset',
  'portfolioDelta',
  'portfolioGamma',
  'portfolioTheta',
  'portfolioVega',
  'callsPutsValue',
]
const id = '1'
describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()
  process.env[ENV_ETHEREUM_RPC_URL] = process.env[ENV_ETHEREUM_RPC_URL] || 'http://localhost:8545/'

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
    // using dynamic-hedging local node at commit: 0cf1a20ed07342da2c6cb64c0fe9afe00b275407
    // populate node state first with: "npx hardhat test ./test/OracleCoreLogic.ts --network localhost"
    // local node must be running at: http://localhost:8545/ prior to running the test
    const protocolAddress =
      process.env['PROTOCOL_ADDRESS'] || '0xeF31027350Be2c7439C1b0BE022d49421488b72C'
    const underlyingAsset =
      process.env['UNDERLYING_ASSET'] || '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' // WETH
    const strikeAsset = process.env['STRIKE_ASSET'] || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' // USDC
    const data: AdapterRequest = {
      id,
      data: {
        underlyingAsset,
        strikeAsset,
        protocolAddress,
      },
    }

    it('should request data using real endpoint', async () => {
      const jobID = '1'
      const execute = makeExecute()
      try {
        const res = await execute(data as AdapterRequest, {})
        if (!res.result) {
          throw new Error('no result')
        }
        dataKeys.forEach((k) => {
          expect(res.data[k]).toBeDefined()
        })
      } catch (error) {
        console.log({ error })
        const errorResp = Requester.errored(jobID, error)
        assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
      }
    })
  })
})
