const request = require('supertest')
const createApp = require('../src/app')
const app = createApp();
const mongoose = require('mongoose')
const { User, Post } = require('../src/db')

const api = request(app)

const initialUsers = [
  {
    name: "Carlos",
    email: "carlos@gmail.com",
    password: "abc123"
  },
  {
    name: "Mario",
    email: "mario@hotmail.com",
    password: "123456789"
  }
]

let initialPosts = []

const constants = {
  FAKEID: '60f71835b9dafe48c47050aa',
  INVALIDID: '123',
  INVALIDTOKEN: 'eyJhbGciOiJIsInR5cCI6IkpXVABC.eyJfaWQiOiI2MGY4MmEymYjYzODEiLCJuYW1lIjoiY2FybG9zIiwiZW1haWwYXRlZEFowLCJpYXQiOjE2MjY4ODUxODgsImV4cCI6MTYyNjg4NjA4OH0.kKSzQV9Yq3fQz2Kz3Z5WAZNSKqAEl6YSXlWE'
}

let user1 = {}
let user2 = {}
let token = ''

describe('USER tests', () => {

  beforeAll(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});
    user1 = await User.create(initialUsers[0])
    user2 = await User.create(initialUsers[1])
    initialPosts = [
      {
        title: "How to code",
        description: "How to code with javascript",
        user: user2.id.toString()
      },
      {
        title: "Go as backend language",
        description: "How to code with Go",
        user: user2.id
      }
    ]
    await Post.create(initialPosts)

    const response = await api
      .post('/login')
      .send({
        email: user2.email,
        password: initialUsers[1].password
      })

    token = response.body.token; // save the token
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('GET /api/users', () => {
    test('return array of users as JSON', async () => {
      await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two users', async () => {
      const response = await api.get('/api/users')
      expect(response.body).toHaveLength(initialUsers.length)
    })

    test('there is a user called Carlos', async () => {
      const response = await api.get('/api/users')
      const contents = response.body.map(user => user.name)
      expect(contents).toContain('Carlos')
    })
  });

  describe('POST /', () => {
    test('a new user can be added', async () => {
      const newUser = {
        name: "Alcira",
        email: "alcira@hotmail.com",
        password: "123456789"
      }
      const response = await api.post('/').send(newUser)
      expect(response.statusCode).toBe(201)
      expect(response.body.email).toBe(newUser.email)
    })

    test('a new user with a email already registered cannot be added', async () => {
      const newUser = {
        name: "Carlos2",
        email: "carlos@gmail.com",
        password: "123456789"
      }
      const response = await api.post('/').send(newUser)
      expect(response.statusCode).toBe(400)
      expect(response.body.message).toBe('email already registered')
    })

    test('a new user without data cannot be added', async () => {
      const newUser = {}
      const response = await api.post('/').send(newUser)
      expect(response.body.message).toContain('User validation failed')
    })
  });

  describe('GET /api/users/{id}', () => {
    test('should return a user data', async () => {
      const userId = user1.id.toString()
      const response = await api.get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.name).toBe(user1.name)
      expect(response.body.email).toBe(user1.email)
    })

    test('should return BADREQUEST if id is invalid', async () => {
      const userId = constants.INVALIDID

      const response = await api.get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(400)
    })

    test('should return NOTFOUND if id does not exist', async () => {
      const userId = constants.FAKEID

      const response = await api.get(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })

    test('should return UNAUTHORIZED if token is invalid', async () => {
      const userId = user1.id.toString()

      const response = await api.get(`/api/users/${userId}`).set('Authorization', `Bearer ${constants.INVALIDTOKEN}`)
      expect(response.statusCode).toBe(401)
    })
  });

  describe('PUT /api/users/{id}', () => {
    test('should edit a user data', async () => {
      const userId = user1.id.toString()
      const newData = {
        name: 'Jose',
        email: 'jose@gmail.com'
      }
      const response = await api.put(`/api/users/${userId}`).send(newData).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.name).toBe(newData.name)
      expect(response.body.email).toBe(newData.email)
    })

    test('should return BADREQUEST if id is invalid', async () => {
      const userId = constants.INVALIDID

      const newData = {
        name: 'Jose',
        email: 'jose@gmail.com'
      }
      const response = await api.put(`/api/users/${userId}`).send(newData).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(400)
    })

    test('should return NOTFOUND if id does not exist', async () => {
      const userId = constants.FAKEID

      const newData = {
        name: 'Jose',
        email: 'jose@gmail.com'
      }
      const response = await api.put(`/api/users/${userId}`).send(newData).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })

    test('should return UNAUTHORIZED if token is invalid', async () => {
      const userId = user1.id.toString()
      const newData = {
        name: 'Jose',
        email: 'jose@gmail.com'
      }

      const response = await api.put(`/api/users/${userId}`).set('Authorization', `Bearer ${constants.INVALIDTOKEN}`)
      expect(response.statusCode).toBe(401)
    })
  });


  describe('DELETE /api/users/{id}', () => {
    test('should delete a user', async () => {
      const userId = user1.id.toString()

      const response = await api.delete(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toBe(true)
    })

    test('should return BADREQUEST if id is invalid', async () => {
      const userId = constants.INVALIDID

      const response = await api.delete(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(400)
    })

    test('should return NOTFOUND if user does not exist', async () => {
      const userId = constants.FAKEID

      const response = await api.delete(`/api/users/${userId}`).set('Authorization', `Bearer ${token}`)
      expect(response.statusCode).toBe(404)
    })

    test('should return UNAUTHORIZED if token is invalid', async () => {
      const userId = user1.id.toString()

      const response = await api.delete(`/api/users/${userId}`).set('Authorization', `Bearer ${constants.INVALIDTOKEN}`)
      expect(response.statusCode).toBe(401)
    })
  });

  describe('GET /api/users/{id}/posts', () => {
    test('return array of post as JSON', async () => {
      const userId = user2.id.toString()
      await api
        .get(`/api/users/${userId}/posts`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('return array of post as JSON', async () => {
      const userId = user2.id.toString()
      await api
        .get(`/api/users/${userId}/posts`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two posts', async () => {
      const userId = user2.id.toString()

      const response = await api.get(`/api/users/${userId}/posts`)
      expect(response.body).toHaveLength(initialPosts.length)
    })

    test('there is a post contains Go', async () => {
      const userId = user2.id.toString()

      const response = await api.get(`/api/users/${userId}/posts`)
      const titles = response.body.map(post => post.title)
      expect(titles).toContain('Go as backend language')
    })
  })
});