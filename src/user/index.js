var express = require('express');
const checkObjectId = require('../helpers/checkObjectId');
const isAuth = require('../helpers/isAuth');
var router = express.Router();

const { deleteOne, edit, getAll, getOne, postsByUser } = require('./controller');

router.get('/', getAll);

router.get('/:id',
  checkObjectId,
  isAuth,
  getOne);

router.put('/:id',
  checkObjectId,
  isAuth,
  edit);

router.delete('/:id',
  checkObjectId,
  isAuth,
  deleteOne)
router.get('/:id/posts', checkObjectId, postsByUser);

module.exports = router;