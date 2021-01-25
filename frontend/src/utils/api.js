class Api {
  constructor(config) {
    this._url = config.url;
    this._contentType = config.headers["Content-type"];
  }

    _getResponse(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(new Error(`Ошибка: ${res.status}`));
  }

  getInitialCardList() {
    return fetch(`${this._url}/cards`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
    }).then(this._getResponse);
  }

  saveCard(cardData) {
    return fetch(`${this._url}/cards`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
      body: JSON.stringify({
        name: cardData.cardTitle,
        link: cardData.cardSrc,
      }),
    }).then(this._getResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this._url}/cards/${cardId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
    }).then(this._getResponse);
  }

  changeLikeCardStatus(cardId, isLiked) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: isLiked ? "PUT" : "DELETE",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
    }).then(this._getResponse);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
    }).then(this._getResponse);
  }

  saveUserInfo(inputsValues) {
    return fetch(`${this._url}/users/me`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
      body: JSON.stringify({
        name: inputsValues.name,
        about: inputsValues.about,
      }),
    }).then(this._getResponse);
  }

  changeAvatar(inputValue) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-type": this._contentType,
      },
      body: JSON.stringify({
        avatar: inputValue.avatar,
      }),
    }).then(this._getResponse);
  }
}

export const api = new Api({
  url: 'http://api.vlg.students.nomoredomains.rocks/',
  headers: {
    "Content-type": "application/json",
  },
});
