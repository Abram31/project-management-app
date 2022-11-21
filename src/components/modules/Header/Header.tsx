import { ROUTES } from 'constants/constants';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from './Button/Button';
import { ChangeLang } from './ChangeLang/ChangeLang';
import module from './Header.module.scss';

export const Header = () => {
  const [prevScroll, setScroll] = useState(false);
  useEffect(() => {
    window.onscroll = () => {
      window.scrollY < 10 ? setScroll(false) : setScroll(true);
    };
  }, []);
  return (
    <header className={`${module.header} ${prevScroll && module.header__active}`}>
      <div className={module.wrapper_logo}>
        <NavLink className={module.logo} to="/">
          Project Management System
        </NavLink>{' '}
      </div>
      <div className={module.wrapper_login_register}>
        <Button
          pathLink={ROUTES.signin}
          borderColor="none"
          colorText="whitesmoke"
          title="Войти"
          fullBackground="rgba(68, 165, 79, 1)"
        />
        <Button
          pathLink={ROUTES.signup}
          borderColor="none"
          colorText="whitesmoke"
          title="Регистрация"
          fullBackground="rgba(204, 124, 54, 1)"
        />
        <ChangeLang />
      </div>
    </header>
  );
};
