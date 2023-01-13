type Brand<K, T> = K & { __brand: T }

export type UserID = Brand<string, 'User'>

export type User = {
  id: UserID
  username: string
  age: number
  hobbies: string[]
}
