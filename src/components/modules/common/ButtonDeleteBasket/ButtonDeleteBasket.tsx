import React, { MouseEventHandler } from 'react';
import module from './ButtonDeleteBasket.module.scss';

interface ButtonDeleteBasketProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
  id?: string;
}
export const ButtonDeleteBasket = ({ onClick, id }: ButtonDeleteBasketProps) => {
  return <div onClick={onClick} className={module.basket} data-id={id}></div>;
};
