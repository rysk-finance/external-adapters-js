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
  jest.setTimeout(50000)
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
      process.env['PROTOCOL_ADDRESS'] || '0x2AeDFAd2A01a87A1cE9e57a4de757aAC5d715D52'
    const underlyingAsset =
      process.env['UNDERLYING_ASSET'] || '0xE32513090f05ED2eE5F3c5819C9Cce6d020Fefe7' // WETH
    const strikeAsset = process.env['STRIKE_ASSET'] || '0x3C6c9B6b41B9E0d82FeD45d9502edFFD5eD3D737' // USDC
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
