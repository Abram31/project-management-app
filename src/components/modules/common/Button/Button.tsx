import { HeaderProps } from 'components/modules/Header/Header';
import React from 'react';
import { NavLink } from 'react-router-dom';
import module from './Button.module.scss';

interface ButtonProps extends HeaderProps {
  title: string;
  pathLink: string;
  fullBackground?: string;
  borderColor: string;
  colorText: string;
  disabled?: boolean;
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
}: ButtonProps) => {
  return (
    <NavLink
      to={pathLink}
      className={`${module.button} ${disabled && module.button_disabled}`}
      style={{ backgroundColor: fullBackground, borderColor: borderColor, color: colorText }}
      onClick={handleLogin || handleLogout}
    >
      {title}
    </NavLink>
  );
};
