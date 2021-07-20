var express = require('express');
var router = express.Router();

const { create, deleteOne, edit, getAll, getOne, postsByUser } = require('./controller');

router.get('/', getAll);
router.get('/:id', getOne);
router.post('/', create);
router.put('/:id', edit);
router.delete('/:id', deleteOne)
router.get('/:id/posts', postsByUser);

module.exports = router;