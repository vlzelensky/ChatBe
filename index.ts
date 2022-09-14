const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const user = require('./controllers/user.ts');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/user/register', user.register);
app.post('/user/login', user.login);
app.get('/user/me', user.getUser);

mongoose.connect('mongodb://localhost:27017/', {
  dbName: 'chat-db',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(8080, () => {
  console.log('server has started, PORT: 8080');
});
