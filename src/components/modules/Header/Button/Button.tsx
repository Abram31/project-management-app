import React from 'react';
import { NavLink } from 'react-router-dom';
import module from './Button.module.scss';

interface ButtonProps {
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
}: ButtonProps) => {
  return (
    <NavLink
      to={pathLink}
      className={`${module.button} ${disabled && module.button_disabled}`}
      style={{ backgroundColor: fullBackground, borderColor: borderColor, color: colorText }}
    >
      {title}
    </NavLink>
  );
};
