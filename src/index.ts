import http from 'node:http'
import dotenv from 'dotenv'

import { handleRoute } from './routes'

dotenv.config()

const host = 'localhost'
const port = Number(process.env.PORT)

const server = http.createServer()

server.on('request', handleRoute)

server.listen(port, host, () => {
  console.log(`server listening on http://${host}:${port}`)
})
