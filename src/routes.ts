import * as uuid from 'uuid'
import { RequestListener, IncomingMessage, ServerResponse } from 'node:http'

import { isUserExists, getUsers, getUser, deleteUser, createUser, updateUser } from './users'
import { User, UserID } from 'types'

export const handleRoute: RequestListener = (req, res) => {
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
      notFound(res)
  }
}

const handleGET: RequestListener = (req, res) => {
  if (req.url === '/api/users') {
    const users = getUsers()
    success(res, { data: users })
  } else if (req.url?.match(/\/api\/users\/[\w\-\d]+/)) {
    const id = req.url?.split('/')[3] as UserID

    if (!uuid.validate(id)) {
      badRequest(res)
    } else if (isUserExists(id)) {
      const user = getUser(id)
      success(res, { data: user })
    } else {
      notFound(res)
    }
  } else {
    notFound(res)
  }
}

const handlePOST: RequestListener = async (req, res) => {
  if (req.url === '/api/users') {
    try {
      const data = (await parseReqParams(req)) as User

      if (['username', 'age', 'hobbies'].every((key) => key in data)) {
        const user = createUser(data)
        success(res, { data: user, status: 201 })
      } else {
        badRequest(res)
      }
    } catch (e) {
      serverError(res, e)
    }
  } else {
    notFound(res)
  }
}

const handlePUT: RequestListener = async (req, res) => {
  if (req.url?.match(/\/api\/users\/[\w\-\d]+/)) {
    try {
      const id = req.url?.split('/')[3] as UserID

      if (!uuid.validate(id)) {
        badRequest(res)
      } else if (isUserExists(id)) {
        const data = (await parseReqParams(req)) as User
        updateUser(id, data)
        success(res, { data })
      } else {
        notFound(res)
      }
    } catch (e) {
      serverError(res, e)
    }
  } else {
    notFound(res)
  }
}

const handleDELETE: RequestListener = (req, res) => {
  if (req.url?.match(/\/api\/users\/[\w\-\d]+/)) {
    const id = req.url?.split('/')[3] as UserID

    if (!uuid.validate(id)) {
      badRequest(res)
    } else if (isUserExists(id)) {
      deleteUser(id)
      success(res, { data: id, status: 204 })
    } else {
      notFound(res)
    }
  } else {
    notFound(res)
  }
}

function parseReqParams(req: IncomingMessage) {
  let body = ''

  return new Promise((resolve, reject) => {
    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (e) {
        reject(e)
      }
    })
  })
}

type SUCCESS_STATUSES = 200 | 201 | 204

function success(res: ServerResponse, p: { data: unknown; status?: SUCCESS_STATUSES }) {
  res.writeHead(p.status || 200, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ data: p.data }))
}

function badRequest(res: ServerResponse) {
  res.writeHead(400)
  res.end()
}

function notFound(res: ServerResponse) {
  res.writeHead(404)
  res.end()
}

function serverError(res: ServerResponse, e: unknown) {
  res.writeHead(500)
  res.end(JSON.stringify({ message: e instanceof Error ? e.message : 'Something went wrong' }))
}
