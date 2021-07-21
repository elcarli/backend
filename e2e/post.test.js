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
  INVALIDID: '123'
}

let user1 = {}
let user2 = {}
let post1 = {}
let post2 = {}

describe('POSTS tests', () => {

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
    post1 = await Post.create(initialPosts[0])
    post2 = await Post.create(initialPosts[1])
  })

  afterAll(async () => {
    await mongoose.disconnect()
  })

  describe('GET /api/posts', () => {
    test('return array of posts as JSON', async () => {
      await api
        .get('/api/posts')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('there are two posts', async () => {
      const response = await api.get('/api/posts')
      expect(response.body).toHaveLength(initialPosts.length)
    })

    test('there is a post with title How to code', async () => {
      const response = await api.get('/api/posts')
      const contents = response.body.map(post => post.title)
      expect(contents).toContain('How to code')
    })
  });

  describe('POST /api/posts', () => {
    test('a new post can be added', async () => {
      const newPost = {
        title: "New post",
        description: "This is a description example",
        userId: user1.id.toString()
      }
      const response = await api.post('/api/posts').send(newPost)
      expect(response.statusCode).toBe(201)
      expect(response.body.title).toBe(newPost.title)
    })

    test('a new post without user cannot be added', async () => {
      const newPost = {
        title: "New post",
        description: "This is a description example"
      }
      const response = await api.post('/api/posts').send(newPost)
      expect(response.body.message).toContain('User does not exist')
    })
  });

  describe('GET /api/posts/{id}', () => {
    test('should return a post data', async () => {      
      const postId = post1.id.toString()
      const response = await api.get(`/api/posts/${postId}`)
      expect(response.statusCode).toBe(200)
      expect(response.body.title).toBe(post1.title)
      expect(response.body.description).toBe(post1.description)
    })

    test('should return BADREQUEST if id is invalid', async () => {
      const postId = constants.INVALIDID

      const response = await api.get(`/api/posts/${postId}`)
      expect(response.statusCode).toBe(400)
    })

    test('should return NOTFOUND if id does not exist', async () => {
      const postId = constants.FAKEID

      const response = await api.get(`/api/posts/${postId}`)
      expect(response.statusCode).toBe(404)
    })
  });

  describe('PUT /api/posts/{id}', () => {
    test('should edit a post data', async () => {
      const postId = post1.id.toString()
      const newData = {
        title: 'New Title',
        description: 'New Description',
        user: user1.id
      }
      const response = await api.put(`/api/posts/${postId}`).send(newData)
      expect(response.statusCode).toBe(200)
      expect(response.body.title).toBe(newData.title)
      expect(response.body.description).toBe(newData.description)
    })

    test('should return BADREQUEST if id is invalid', async () => {
      const postId = constants.INVALIDID

      const newData = {
        title: 'New Title',
        description: 'New Description',
        user: user1.id
      }
      const response = await api.put(`/api/posts/${postId}`).send(newData)
      expect(response.statusCode).toBe(400)
    })

    test('should return NOTFOUND if id does not exist', async () => {
      const postId = constants.FAKEID

      const newData = {
        title: 'New Title',
        description: 'New Description',
        user: user1.id
      }
      const response = await api.put(`/api/posts/${postId}`).send(newData)
      expect(response.statusCode).toBe(404)
    })
  });

  describe('DELETE /api/posts/{id}', () => {
    test('should delete a post', async () => {
      const postId = post1.id.toString()

      const response = await api.delete(`/api/posts/${postId}`)
      expect(response.statusCode).toBe(200)
      expect(response.body).toBe(true)
    })

    test('should return BADREQUEST if id is invalid', async () => {
      const postId = constants.INVALIDID

      const response = await api.delete(`/api/posts/${postId}`)
      expect(response.statusCode).toBe(400)
    })

    test('should return NOTFOUND if post does not exist', async () => {
      const postId = constants.FAKEID

      const response = await api.delete(`/api/posts/${postId}`)
      expect(response.statusCode).toBe(404)
    })
  });

});