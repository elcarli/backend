const createApp = require('./app');
require('dotenv').config();

const app = createApp();

app.listen(process.env.PORT, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
});