import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';

const Header = ({ handleLogout, email }) => (
  <header className="header page__header">
    <div className="header__logo" />
    <Switch>
      <Route exact path="/">
        <div className="header__wrapper">
          <p className="header__email">{email}</p>
          <Link
            to="/sign-in"
            onClick={handleLogout}
            className="header__link"
          >Выйти</Link>
        </div>
      </Route>

      <Route path="/sign-in">
        <Link to="/sign-up" className="header__link">Зарегистрироваться</Link>
      </Route>

      <Route path="/sign-up">
        <Link to="/sign-in" className="header__link">Войти</Link>
      </Route>
    </Switch>
  </header>
);

export default Header;
