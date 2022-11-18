import React from 'react';
import { NavLink } from 'react-router-dom';

import { User } from 'App';

import classes from './header.module.scss';

type Props = { user: User | null; handleLogin: () => void; handleLogout: () => void };

const Header = ({ user, handleLogin, handleLogout }: Props) => {
  const setActive = ({ isActive }: { isActive: boolean }) =>
    isActive ? classes.link__active : classes.link;

  return (
    <header className={classes.header}>
      <div className={classes.header__container}>
        <NavLink className={setActive} to="/">
          Welcome
        </NavLink>
        {user ? (
          <>
            <div>
              <NavLink className={setActive} to="/boards">
                Boards
              </NavLink>
              <NavLink className={setActive} to="/edit">
                Edit profile
              </NavLink>
            </div>
            <button onClick={handleLogout}>Sign out</button>
          </>
        ) : (
          <div className="buttons">
            <button onClick={handleLogin}>Sign in</button>
            <button onClick={handleLogin}>Sign up</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
