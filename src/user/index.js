var express = require('express');
const checkObjectId = require('../helpers/checkObjectId');
var router = express.Router();

const { create, deleteOne, edit, getAll, getOne, postsByUser } = require('./controller');

router.get('/', getAll);
router.get('/:id', checkObjectId, getOne);
router.post('/', create);
router.put('/:id', checkObjectId, edit);
router.delete('/:id', checkObjectId, deleteOne)
router.get('/:id/posts', checkObjectId, postsByUser);

module.exports = router;