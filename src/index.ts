import http from 'node:http'
import dotenv from 'dotenv'
import process from 'node:process'
import cluster from 'node:cluster'
import { cpus } from 'node:os'

import { handleRoute } from './routes'

dotenv.config()

const port = Number(process.env.PORT)

export function createApp() {
  const server = http.createServer()
  server.on('request', handleRoute)
  return server
}

if (process.env.NODE_ENV === 'production') {
  const app = createApp()
  app.listen(port)
}

if (process.env.NODE_ENV === 'multi') {
  const numCPUs = cpus().length

  if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running on port: ${port}`)

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`)
    })
  } else {
    const app = createApp()
    app.listen(port)

    console.log(`Worker ${process.pid} started on port: ${port}`)
  }
}
