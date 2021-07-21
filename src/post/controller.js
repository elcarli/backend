const { Post, User } = require("../db");

async function getAll(req, res, next) {
  try {
    const result = await Post.find().populate('user')
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getOne({ params: { id } }, res, next) {
  try {
    const result = await Post.findById(id).populate('user')
    if (result) {
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'Post does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function create({ body: { title, description, userId } }, res, next) {
  try {
    const user = await User.findById(userId)
    if (user) {
      const newPost = {
        title, description, user: user.id
      }
      const result = await Post.create(newPost)
      res.status(201).json(result)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function edit({ params: { id }, body }, res, next) {
  try {
    const post = await Post.findById(id)
    if (post) {
      Object.assign(post, body)
      const result = await post.save()
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'Post does not exist' })
    }
    
  } catch (error) {
    next(error)
  }
}

async function deleteOne({ params: { id } }, res, next) {
  try {
    const result = await Post.findByIdAndDelete(id)
    if (result) {
      res.status(200).send(true)
    } else {
      res.status(404).send(false)
    }
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getOne,
  create,
  edit,
  deleteOne
}