import { AdapterRequest } from '@chainlink/ea-bootstrap'
import request, { SuperTest, Test } from 'supertest'
import process from 'process'
import { server as startServer } from '../../src'
import nock from 'nock'
import { mockResponseSuccess } from './fixtures'
import { AddressInfo } from 'net'

let oldEnv: NodeJS.ProcessEnv

describe('execute', () => {
  let fastify: FastifyInstance
  let req: SuperTest<Test>

  beforeAll(async () => {
    oldEnv = JSON.parse(JSON.stringify(process.env))
    process.env.RPC_URL = process.env.RPC_URL || 'https://test-rpc-url:8545'

    if (process.env.RECORD) nock.recorder.rec()

    fastify = await startServer()
    req = request(`localhost:${(fastify.server.address() as AddressInfo).port}`)
  })

  afterAll((done) => {
    process.env = oldEnv

    if (process.env.RECORD) nock.recorder.play()

    nock.restore()
    nock.cleanAll()
    nock.enableNetConnect()
    fastify.close(done)
  })

  describe('wallet endpoint', () => {
    const data: AdapterRequest = {
      id: '1',
      data: {
        network: 'bitcoin',
        chainId: 'mainnet',
        contractAddress: '0x0123456789abcdef0123456789abcdef01234567',
      },
    }

    it('returns success', async () => {
      mockResponseSuccess()

      const response = await req
        .post('/')
        .send(data)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toMatchSnapshot()
    })
  })
})
