import { onClickProps } from 'components/modules/Main/PageWithBoards/PageWIthBoards';
import React, { MouseEventHandler } from 'react';
import module from './ButtonDeleteBasket.module.scss';

interface ButtonDeleteBasketProps {
  onClick?: MouseEventHandler<HTMLDivElement>;
}
export const ButtonDeleteBasket = ({ onClick }: ButtonDeleteBasketProps) => {
  return <div onClick={onClick} className={module.basket}></div>;
};
