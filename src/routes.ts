import * as uuid from 'uuid'
import { RequestListener } from 'node:http'

import { User } from './types'
import { isUserExists, getUsers, getUser, deleteUser, createUser, updateUser } from './users'
import {
  notFound,
  success,
  badRequest,
  created,
  serverError,
  parseReqParams,
  isUserRoute,
  getUserIdFromUrl
} from './utils'

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
  } else if (req.url && isUserRoute(req.url)) {
    const id = getUserIdFromUrl(req.url)

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
        created(res, { data: user })
      } else {
        badRequest(res)
      }
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'Server error'
      serverError(res, errorMessage)
    }
  } else {
    notFound(res)
  }
}

const handlePUT: RequestListener = async (req, res) => {
  if (req.url && isUserRoute(req.url)) {
    try {
      const id = getUserIdFromUrl(req.url)

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
  if (req.url && isUserRoute(req.url)) {
    const id = getUserIdFromUrl(req.url)

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
