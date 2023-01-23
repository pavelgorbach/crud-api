type Brand<K, T> = K & { __brand: T }

export type UserID = Brand<string, 'User'>

export type User = {
  id: UserID
  username: string
  age: number
  hobbies: string[]
}

export type ResposeCodes = SuccessCodes | ClientErrorCodes | ServerErrorCodes
export type SuccessCodes = 200 | 201 | 204
export type ClientErrorCodes = 400 | 404
export type ServerErrorCodes = 500
