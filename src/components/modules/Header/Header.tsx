import React, { useEffect, useState } from 'react';
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
        <a className={module.logo} href="">
          Project Management System
        </a>{' '}
      </div>
      <div className={module.wrapper_login_register}>
        <a href="" className={module.login}>
          Войти
        </a>
        <a href="" className={module.register}>
          Зарегистрироваться
        </a>
      </div>
    </header>
  );
};
