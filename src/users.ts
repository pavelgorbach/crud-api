import { v4 as uuidv4 } from 'uuid'

import { User, UserID } from 'types'

const users = new Map<UserID, User>()

function User(data: Omit<User, 'id'>): User {
  return {
    id: uuidv4() as UserID,
    ...data
  }
}

export function createUser(data: Omit<User, 'id'>) {
  const newUser = User(data)
  users.set(newUser.id, newUser)
  return newUser
}

export function getUsers() {
  return [...users]
}

export function getUser(id: UserID) {
  return users.get(id)
}

export function updateUser(id: UserID, user: User) {
  if (!users.has(id)) return null

  users.set(id, user)
  return user
}

export function deleteUser(id: UserID) {
  users.delete(id)
}
