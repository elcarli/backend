const { User, Post } = require("../db");

async function getAll(req, res, next) {
  try {
    const result = await User.find()
    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getOne({ params: { id } }, res, next) {
  try {
    const user = await User.findById(id)
    if (user) {
      const result = await User.findById(id)
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function create({ body: { name, email, password } }, res, next) {
  try {
    const users = await User.find({ email: email })
    if (users.length > 0) {
      res.status(400).json({ message: 'email already registered' })
    } else {
      const newUser = {
        name, email, password
      }
      let result = await User.create(newUser)

      const data = result.toObject()
      delete data.password

      res.status(201).json(data)
    }
  } catch (error) {
    next(error)
  }
}

async function edit({ params: { id }, body }, res, next) {
  try {
    const user = await User.findById(id)
    if (user) {
      Object.assign(user, body)
      const result = await user.save()
      res.status(200).json(result)
    } else {
      res.status(404).json({ message: 'User does not exist' })
    }
  } catch (error) {
    next(error)
  }
}

async function deleteOne({ params: { id } }, res, next) {
  try {
    const result = await User.findByIdAndDelete(id)
    if (result) {
      res.status(200).send(true)
    } else {
      res.status(404).send(false)
    }
  } catch (error) {
    next(error)
  }
}

async function postsByUser({ params: { id } }, res, next) {
  try {
    const user = await User.findById(id)
    if (user) {
      const posts = await Post.find({ user: id })
      res.status(200).json(posts)
    } else {
      res.status(404).json({ message: 'User does not exist' })
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
  deleteOne,
  postsByUser
}