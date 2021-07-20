const createApp = require('./app');

const app = createApp();

app.listen(3000, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
});