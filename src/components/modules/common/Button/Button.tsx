import { HeaderProps } from 'components/modules/Header/Header';
import React, { MouseEventHandler } from 'react';
import { NavLink } from 'react-router-dom';
import module from './Button.module.scss';

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
  return (
    <NavLink
      to={pathLink}
      className={`${module.button} ${disabled && module.button_disabled}`}
      style={{
        backgroundColor: fullBackground,
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
