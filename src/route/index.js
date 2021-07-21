var express = require('express');
var router = express.Router();

const { signin, login } = require('../user/controller');

router.post('/', signin);
router.post('/login', login);

module.exports = router;