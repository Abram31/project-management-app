import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import classes from './header.module.scss';

import { useAuthUser } from 'hooks/hooks';
import { ROUTES } from 'constants/constants';

type Props = { handleLogin: () => void; handleLogout: () => void };

const Header = ({ handleLogin, handleLogout }: Props) => {
  const { userExist } = useAuthUser();
  const setActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? classes.link__active : classes.link;

  return (
    <header className={classes.header}>
      <div className={classes.header__container}>
        <NavLink className={setActive} to="/">
          Welcome
        </NavLink>
        {userExist ? (
          <>
            <div>
              <NavLink className={setActive} to={ROUTES.boards}>
                Boards
              </NavLink>
              <NavLink className={setActive} to={ROUTES.boards}>
                Edit profile
              </NavLink>
            </div>
            <button onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <div className="buttons">
            <Link onClick={handleLogin} to={ROUTES.signin}>
              Sign in
            </Link>
            <Link onClick={handleLogin} to={ROUTES.signup}>
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
