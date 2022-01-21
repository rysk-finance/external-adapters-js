import { AdapterRequest } from '@chainlink/types'
import request, { SuperTest, Test } from 'supertest'
import * as process from 'process'
import { server as startServer } from '../../src'
import * as nock from 'nock'
import * as http from 'http'
import {
  mockForexSingleSuccess,
  mockForexBatchedSuccess,
  mockLiveSuccess,
  mockResponseFailure,
} from './fixtures'
import { AddressInfo } from 'net'

describe('execute', () => {
  const id = '1'
  let server: http.Server
  let req: SuperTest<Test>

  beforeAll(async () => {
    process.env.CACHE_ENABLED = 'false'
    process.env.API_KEY = process.env.API_KEY || 'fake-api-key'
    if (process.env.RECORD) {
      nock.recorder.rec()
    }
    server = await startServer()
    req = request(`localhost:${(server.address() as AddressInfo).port}`)
  })

  afterAll((done) => {
    if (process.env.RECORD) {
      nock.recorder.play()
    }

    nock.restore()
    nock.cleanAll()
    nock.enableNetConnect()
    server.close(done)
  })

  describe('forex  api', () => {
    it('should return success for single base/quote pair', async () => {
      const data: AdapterRequest = {
        id,
        data: {
          endpoint: 'forex',
          base: 'ETH',
          quote: 'USD',
        },
      }

      mockForexSingleSuccess()
      const response = await req
        .post('/')
        .send(data)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
      expect(response.body).toMatchSnapshot()
    })

    // NOTE: batching currently disabled, awaiting service agreement
    //   it('should return success for batched base/quote pairs', async () => {
    //     const data: AdapterRequest = {
    //       id,
    //       data: {
    //         endpoint: 'forex',
    //         base: ['ETH', 'BTC'],
    //         quote: ['USD', 'JPY'],
    //       },
    //     }

    //     mockForexBatchedSuccess()
    //     const response = await req
    //       .post('/')
    //       .send(data)
    //       .set('Accept', '*/*')
    //       .set('Content-Type', 'application/json')
    //       .expect('Content-Type', /json/)
    //       .expect(200)
    //     expect(response.body).toMatchSnapshot()
    //   })
  })

  describe('live  api', () => {
    const data: AdapterRequest = {
      id,
      data: {
        endpoint: 'live',
        base: 'AAPL',
      },
    }

    it('should return success', async () => {
      mockLiveSuccess()

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

  describe('live  api with invalid base', () => {
    const data: AdapterRequest = {
      id,
      data: {
        endpoint: 'live',
        base: 'NON-EXISTING',
      },
    }

    it('should return failure', async () => {
      mockResponseFailure()

      const response = await req
        .post('/')
        .send(data)
        .set('Accept', '*/*')
        .set('Content-Type', 'application/json')
        .expect('Content-Type', /json/)
        .expect(500)
      expect(response.body).toMatchSnapshot()
    })
  })
})
