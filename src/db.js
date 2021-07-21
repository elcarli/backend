require('dotenv').config();
const mongoose = require('mongoose');

let MONGO_URI = process.env.MONGO_URI;
if (process.env.NODE_ENV === 'test') {
  MONGO_URI = process.env.MONGO_URI_TEST
}
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