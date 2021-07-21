const jwt = require('express-jwt');
require('dotenv').config();

module.exports = jwt({ algorithms: ['HS256'], secret: process.env.JWT_SECRET })