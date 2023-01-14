import http from 'node:http'
import dotenv from 'dotenv'

import * as constants from './constants'
import routes from './routes'

dotenv.config()

const host = 'localhost'
const port = Number(process.env.PORT) || constants.PORT

const server = http.createServer()

server.on('request', routes)

server.listen(port, host, () => {
  console.log(`server listening on http://${host}:${port}`)
})
