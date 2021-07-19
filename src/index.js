const createApp = require('./app');

const app = createApp();

app.get('/', (req, res) => {
  res.status(200).json({ message: 'HOLI' })
})

app.listen(3000, err => {
  if (err) {
    console.error("Error: ", err);
    return;
  }
});