import { Requester } from '@chainlink/ea-bootstrap'
import { assertError } from '@chainlink/ea-test-helpers'
import { AdapterRequest } from '@chainlink/ea-bootstrap'
import { makeExecute } from '../../src/adapter'

describe('execute', () => {
  const jobID = '1'
  const execute = makeExecute()

  process.env.ETHEREUM_RPC_URL = process.env.ETHEREUM_RPC_URL || 'fake_rpc_url'

  describe('validation error', () => {
    const requests = [
      { name: 'empty body', testData: {} },
      { name: 'empty data', testData: { data: {} } },
      {
        name: 'empty addresses',
        testData: { id: jobID, data: { addresses: [] } },
      },
      {
        name: 'empty result',
        testData: { id: jobID, data: { result: [] } },
      },
      {
        name: 'invalid confirmations (string)',
        testData: {
          id: jobID,
          data: {
            addresses: [{ address: '0xEF9FFcFbeCB6213E5903529c8457b6F61141140d' }],
            confirmations: 'asd',
          },
        },
      },
      {
        name: 'invalid confirmations (float)',
        testData: {
          id: jobID,
          data: {
            addresses: [{ address: '0xEF9FFcFbeCB6213E5903529c8457b6F61141140d' }],
            confirmations: 12.3,
          },
        },
      },
      {
        name: 'invalid confirmations (negative)',
        testData: {
          id: jobID,
          data: {
            addresses: [{ address: '0xEF9FFcFbeCB6213E5903529c8457b6F61141140d' }],
            confirmations: -1,
          },
        },
      },
      {
        name: 'invalid confirmations (over 64)',
        testData: {
          id: jobID,
          data: {
            addresses: [{ address: '0xEF9FFcFbeCB6213E5903529c8457b6F61141140d' }],
            confirmations: 65,
          },
        },
      },
    ]

    requests.forEach((req) => {
      it(`${req.name}`, async () => {
        try {
          await execute(req.testData as AdapterRequest)
        } catch (error) {
          const errorResp = Requester.errored(jobID, error)
          assertError({ expected: 400, actual: errorResp.statusCode }, errorResp, jobID)
        }
      })
    })
  })
})
