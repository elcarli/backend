const express = require('express');
const users = require('./user/index');
const posts = require('./post/index');
const errorHandler = require('./error-handler/error-handler');

function createApp() {

  const app = express();
  app.use(express.json());

  app.use('/api/users', users);
  app.use('/api/posts', posts);
  app.use(errorHandler())

  return app;
}

module.exports = createApp;