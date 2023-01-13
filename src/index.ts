import http from 'node:http'
import dotenv from 'dotenv'

import { getUsers } from './users'

dotenv.config()

const host = 'localhost'
const port = Number(process.env.PORT) || 8000

const server = http.createServer()

server.on('request', (req, resp) => {
  const { method, url } = req

  resp.writeHead(200, { 'Content-Type': 'application/json' })

  if (method === 'GET') {
    switch (url) {
      case '/api/users': {
        const users = getUsers()

        resp.end(
          JSON.stringify({
            data: users
          })
        )
        break
      }
      default:
        resp.writeHead(404)
        resp.end(
          JSON.stringify({
            data: 'Not Found'
          })
        )
    }
  }
})

server.listen(port, host, () => {
  console.log(`listening on http://${host}:${port}`)
})
