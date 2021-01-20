const Card = require('../models/card');

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send(cards))
  .catch((err) => res.status(500).send({ message: err.message }));

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const err = new Error();
      err.statusCode = 404;
      throw err;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: `Передан невалидный id: ${cardId}` });
      }
      if (err.statusCode === 404) {
        return res.status(404).send({ message: 'Нет карточки с указанным id.' });
      }
      return res.status(500).send({ message: `Ошибка сервера: ${err}` });
    });
};

module.exports = { getCards, createCard, deleteCard };
