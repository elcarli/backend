const mongoose = require('mongoose');

function checkObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid ID' })
  }
  next()
}

module.exports = checkObjectId