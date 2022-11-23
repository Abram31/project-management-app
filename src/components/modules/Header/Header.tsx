import { ROUTES } from 'constants/constants';
import { useAuthUser } from 'hooks/hooks';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '../common/Button/Button';
import { ChangeLang } from './ChangeLang/ChangeLang';
import module from './Header.module.scss';

export interface HeaderProps {
  handleLogin?: () => void;
  handleLogout?: () => void;
}
export const Header = ({ handleLogin, handleLogout }: HeaderProps) => {
  const [prevScroll, setScroll] = useState(false);
  const { userExist } = useAuthUser();

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
      {userExist ? (
        <div className={module.wrapper_login_register}>
          <Button
            pathLink={ROUTES.boards}
            colorText="whitesmoke"
            title="Boards"
            fullBackground="#0077b5"
          />
          <Button
            pathLink={ROUTES.edit}
            colorText="whitesmoke"
            title="Edit profile"
            fullBackground="rgba(204, 124, 54, 1)"
          />
          <Button
            pathLink={''}
            colorText="whitesmoke"
            title="Sign out"
            fullBackground="#d84315"
            handleLogout={handleLogout}
          />
          <ChangeLang />
        </div>
      ) : (
        <div className={module.wrapper_login_register}>
          <Button
            pathLink={ROUTES.signin}
            colorText="whitesmoke"
            title="Sing In"
            fullBackground="rgba(68, 165, 79, 1)"
            handleLogin={handleLogin}
          />
          <Button
            pathLink={ROUTES.signup}
            colorText="whitesmoke"
            title="Sing Up"
            fullBackground="rgba(204, 124, 54, 1)"
            handleLogin={handleLogin}
          />
          <ChangeLang />
        </div>
      )}
    </header>
  );
};
