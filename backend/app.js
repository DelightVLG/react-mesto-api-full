require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const path = require('path');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const pageNotFoundRoute = require('./routes/PageNotFound');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  req.user = {
    _id: '5fe37be287e71126a8b57312',
  };

  next();
});

app.use('/', usersRouter);
app.use('/', cardsRouter);
app.use('/', pageNotFoundRoute);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка на стороне сервера' : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
