import { v4 as uuidv4 } from 'uuid'

import { User, UserID } from './types'

export const users = new Map<UserID, User>()

function User(data: Omit<User, 'id'>): User {
  return {
    id: uuidv4() as UserID,
    ...data
  }
}

export function getUsers() {
  return [...users.values()]
}

export function getUser(id: UserID) {
  return users.get(id)
}

export function createUser(data: Omit<User, 'id'>) {
  const newUser = User(data)
  users.set(newUser.id, newUser)
  return newUser
}

export function updateUser(id: UserID, user: User) {
  const userObj = getUser(id)
  users.set(id, { ...userObj, ...user })
  return user
}

export function deleteUser(id: UserID) {
  users.delete(id)
  return id
}

export function isUserExists(id: UserID) {
  return users.has(id)
}
