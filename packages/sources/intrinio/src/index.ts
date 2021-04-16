import * as bootstrap from '@chainlink/ea-bootstrap'
import { makeExecute, startService } from './adapter'
import { AdapterRequest, Execute, ExecuteSync } from '@chainlink/types'
import { makeConfig } from './config'

// Execution helper async => sync
const executeSync = (execute: Execute): ExecuteSync => {
  return (data: AdapterRequest, callback: any) => {
    return execute(data)
      .then((result: any) => callback(result.statusCode, result))
      .catch((error: any) =>
        callback(error.statusCode || 500, bootstrap.Requester.errored(data.id, error)),
      )
  }
}

export const server = (): void => {
  startService(makeConfig())
  bootstrap.server.initHandler(executeSync(makeExecute()))()
}
