import { HeaderProps } from 'components/modules/Header/Header';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import module from './Button.module.scss';
import { useLocation } from 'react-router';

interface ButtonProps extends HeaderProps {
  title: string;
  pathLink: string;
  fullBackground?: string;
  borderColor?: string;
  colorText: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export const Button = ({
  title,
  pathLink,
  fullBackground,
  borderColor,
  colorText,
  disabled,
  handleLogin,
  handleLogout,
  onClick,
}: ButtonProps) => {
  const [active, setActive] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const adress = pathLink.split('/').slice(-1)[0];
    const currentAdress = location.pathname.slice(1);
    adress === currentAdress ? setActive(true) : setActive(false);
  }, [location, pathLink]);
  return (
    <NavLink
      to={pathLink}
      className={`${module.button} ${disabled && module.button_disabled}`}
      style={{
        backgroundColor: `${active ? 'rgb(220 223 225 / 12%)' : fullBackground}`,
        pointerEvents: `${active ? 'none' : 'auto'}`,
        borderColor: borderColor,
        border: borderColor && '1px solid',
        color: colorText,
      }}
      onClick={(event) => {
        handleLogin && handleLogin();
        handleLogout && handleLogout();
        onClick && onClick(event);
      }}
    >
      {title}
    </NavLink>
  );
};
