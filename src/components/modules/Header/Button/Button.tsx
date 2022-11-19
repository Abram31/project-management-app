import React from 'react';
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
    <a
      href={pathLink}
      className={`${module.button} ${disabled && module.button_disabled}`}
      style={{ backgroundColor: fullBackground, borderColor: borderColor, color: colorText }}
      //   disabled={disabled}
    >
      {title}
    </a>
  );
};
