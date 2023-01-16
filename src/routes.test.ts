import { describe, it, expect } from '@jest/globals'
import request from 'supertest'

import { User } from './types'
import { server } from './index'

const user: Omit<User, 'id'> = {
  username: 'John Doe',
  age: 20,
  hobbies: ['sport']
}
describe('GET /users', function () {
  it('responds with json', function (done) {
    request(server).get('/api/users').expect('Content-Type', /json/, done)
  })
  it('responds with an empty array', async function () {
    const response = await request(server).get('/api/users')
    expect(response.body).toEqual([])
  })
  it('responds with statusCode 200', function (done) {
    request(server).get('/api/users').expect(200, done)
  })
})

describe('POST /users', function () {
  it('responds with statusCode 201', async function () {
    const response = await request(server).post('/api/users').send(user)
    expect(response.headers['content-type']).toMatch(/json/)
    expect(response.status).toEqual(201)
    expect(response.body.username).toEqual(user.username)
    expect(response.body.age).toEqual(user.age)
    expect(response.body.hobbies).toEqual(user.hobbies)
  })
})

describe('DELETE /users/{userId}', function () {
  it('responds with statusCode 204 (record found and deleted)', async function () {
    const userResponse = await request(server).post('/api/users').send(user)
    const url = `/api/users/${userResponse.body.id}`
    const response = await request(server).delete(url)
    expect(response.status).toEqual(204)
  })
})
