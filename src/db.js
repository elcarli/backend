require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}).then(db => console.log('Database is connected'))
  .catch(err => console.log(err));

module.exports = {
  User: require('./user/model'),
  Post: require('./post/model')
}