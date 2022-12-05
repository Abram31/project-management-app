import { RouteMain, ROUTES } from 'constants/constants';
import { useAppDispatch, useAuthUser } from 'hooks/hooks';
import { changeLanguage } from 'i18next';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { setLang } from 'store/localizationSlice';
import { Button } from '../common/Button/Button';
import { Burger } from './Burger/Burger';
import { ChangeLang } from './ChangeLang/ChangeLang';
import module from './Header.module.scss';

export interface HeaderProps {
  handleLogin?: () => void;
  handleLogout?: () => void;
}
export const Header = ({ handleLogin, handleLogout }: HeaderProps) => {
  const { t } = useTranslation();
  const [prevScroll, setScroll] = useState(false);
  const [burgerState, setBurgerState] = useState(false);
  const { userExist } = useAuthUser();
  const dispatch = useAppDispatch();

  const handleClickBurger = () => {
    setBurgerState(!burgerState);
  };

  const handleLanguageClick = (lng: string) => {
    dispatch(setLang(lng));
    changeLanguage(lng);
  };

  useEffect(() => {
    window.onscroll = () => {
      window.scrollY < 10 ? setScroll(false) : setScroll(true);
    };
  }, []);
  return (
    <header className={`${module.header} ${prevScroll && module.header__active}`}>
      <div className={module.wrapper_logo}>
        <NavLink className={module.logo} to={RouteMain}>
          {t('ProjectManagementSystem')}
        </NavLink>{' '}
      </div>
      {userExist ? (
        <div
          className={`${module.wrapper_login_register} ${
            burgerState && module.wrapper_login_register__active
          }`}
        >
          <Button
            pathLink={ROUTES.boards}
            onClick={handleClickBurger}
            colorText="whitesmoke"
            title={t('Boards')}
            fullBackground="#0077b5"
          />
          <Button
            pathLink={ROUTES.edit}
            onClick={handleClickBurger}
            colorText="whitesmoke"
            title={t('profile')}
            fullBackground="rgba(204, 124, 54, 1)"
          />
          <Button
            pathLink={`${RouteMain}//`}
            onClick={handleClickBurger}
            colorText="whitesmoke"
            title={t('SignOut')}
            fullBackground="#d84315"
            handleLogout={handleLogout}
          />
          <ChangeLang onHandleClick={handleLanguageClick} />
        </div>
      ) : (
        <div
          className={`${module.wrapper_login_register} ${
            burgerState && module.wrapper_login_register__active
          }`}
        >
          <Button
            pathLink={ROUTES.signin}
            onClick={handleClickBurger}
            colorText="whitesmoke"
            title={t('SignIn')}
            fullBackground="rgba(68, 165, 79, 1)"
            handleLogin={handleLogin}
          />
          <Button
            pathLink={ROUTES.signup}
            onClick={handleClickBurger}
            colorText="whitesmoke"
            title={t('SignUp')}
            fullBackground="rgba(204, 124, 54, 1)"
            handleLogin={handleLogin}
          />
          <ChangeLang onHandleClick={handleLanguageClick} />
        </div>
      )}
      <Burger onClick={handleClickBurger} stateBurger={burgerState} />
    </header>
  );
};
