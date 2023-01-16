import http from 'node:http'
import dotenv from 'dotenv'

import { handleRoute } from './routes'

dotenv.config()

const host = 'localhost'
const port = Number(process.env.PORT)

export const server = http.createServer()

server.on('request', handleRoute)

if (process.env.NODE_ENV !== 'test') {
  server.listen(port, host, () => {
    console.log(`server listening on http://${host}:${port}`)
  })
}
