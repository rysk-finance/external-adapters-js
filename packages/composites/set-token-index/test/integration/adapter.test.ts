import { AdapterRequest, FastifyInstance } from '@chainlink/ea-bootstrap'
import request, { SuperTest, Test } from 'supertest'
import process from 'process'
import nock from 'nock'
import { server as startServer } from '../../src'
import { mockDataProviderResponses } from './fixtures'
import { AddressInfo } from 'net'

let oldEnv: NodeJS.ProcessEnv

beforeAll(() => {
  oldEnv = JSON.parse(JSON.stringify(process.env))
  process.env.CACHE_ENABLED = 'false'
  process.env.RPC_URL = process.env.RPC_URL || 'http://localhost:8545'
  process.env.COINMARKETCAP_ADAPTER_URL =
    process.env.COINMARKETCAP_ADAPTER_URL || 'http://localhost:8082'

  process.env.API_VERBOSE = 'true'
  if (process.env.RECORD) {
    nock.recorder.rec()
  }
})

afterAll(() => {
  process.env = oldEnv
  if (process.env.RECORD) {
    nock.recorder.play()
  }

  nock.restore()
  nock.cleanAll()
  nock.enableNetConnect()
})

describe('execute', () => {
  const id = '1'
  let fastify: FastifyInstance
  let req: SuperTest<Test>

  beforeAll(async () => {
    fastify = await startServer()
    req = request(`localhost:${(fastify.server.address() as AddressInfo).port}`)
    process.env.CACHE_ENABLED = 'false'
  })

  afterAll((done) => {
    fastify.close(done)
  })

  describe('with coinmarketcap source', () => {
    const data: AdapterRequest = {
      id,
      data: {
        source: 'coinmarketcap',
        address: '0x33d63Ba1E57E54779F7dDAeaA7109349344cf5F1',
        adapter: '0x78733Fa5e70E3aB61DC49d93921B289e4B667093',
      },
    }

    it('should return success', async () => {
      mockDataProviderResponses()

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
