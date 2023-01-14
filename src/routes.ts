import * as uuid from 'uuid'
import { IncomingMessage, ServerResponse } from 'node:http'

import { isUserExists, getUsers, getUser, deleteUser, createUser } from './users'
import { User, UserID } from 'types'

const DEFAULT_HEADERS = { 'Content-Type': 'application/json' }

export default function routes(req: IncomingMessage, res: ServerResponse) {
  switch (req.method) {
    case 'GET':
      handleGET(req, res)
      break
    case 'POST':
      handlePOST(req, res)
      break
    case 'PUT':
      handlePUT(req, res)
      break
      break
    case 'DELETE':
      handleDELETE(req, res)
      break
    default:
      defaultHandler(req, res)
  }
}

function handleGET(req: IncomingMessage, res: ServerResponse) {
  if (req.url === '/api/users') {
    const users = getUsers()
    success(res, users)
  } else if (req.url?.match(/\/api\/users\/[\w\-\d]+/)) {
    const id = req.url?.split('/')[3] as UserID

    if (!uuid.validate(id)) {
      badRequest(res)
    } else if (isUserExists(id)) {
      const user = getUser(id)
      success(res, user)
    } else {
      notFound(res)
    }
  } else {
    notFound(res)
  }
}

async function handlePOST(req: IncomingMessage, res: ServerResponse) {
  if (req.url === '/api/users') {
    const data = (await parseReqParams(req)) as User

    if (['username', 'age', 'hobbies'].every((key) => key in data)) {
      const user = createUser(data)
      success(res, user)
    } else {
      badRequest(res)
    }
  } else {
    notFound(res)
  }
}

// TODO: implement Method
async function handlePUT(req: IncomingMessage, res: ServerResponse) {
  if (req.url === '/api/users') {
    res.end(JSON.stringify({ data: 'User updated' }))
  } else {
    notFound(res)
  }
}

async function handleDELETE(req: IncomingMessage, res: ServerResponse) {
  if (req.url?.match(/\/api\/users\/[\w\-\d]+/)) {
    const id = req.url?.split('/')[3] as UserID

    if (!uuid.validate(id)) {
      badRequest(res)
    } else if (isUserExists(id)) {
      deleteUser(id)
      success(res, id)
    } else {
      notFound(res)
    }
  } else {
    notFound(res)
  }
}

function defaultHandler(req: IncomingMessage, res: ServerResponse) {
  res.writeHead(200, DEFAULT_HEADERS)
  res.write(JSON.stringify({ message: `API not found at ${req.url}` }))
  res.end()
}

function parseReqParams(req: IncomingMessage) {
  let body = ''
  return new Promise((resolve) => {
    req.on('data', (chunk) => {
      body += chunk.toString()
    })
    req.on('end', () => {
      resolve(JSON.parse(body))
    })
  })
}

function success(res: ServerResponse, data: unknown) {
  res.writeHead(200, DEFAULT_HEADERS)
  res.end(JSON.stringify({ data }))
}

function badRequest(res: ServerResponse) {
  res.writeHead(400, DEFAULT_HEADERS)
  res.end(JSON.stringify({ data: 'Bad Request' }))
}

function notFound(res: ServerResponse) {
  res.writeHead(400, DEFAULT_HEADERS)
  res.end(JSON.stringify({ data: 'Not Found' }))
}
