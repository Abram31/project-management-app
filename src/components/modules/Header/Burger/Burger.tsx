import React from 'react';
import module from './Burger.module.scss';

interface BurgerProps {
  onClick: () => void;
  stateBurger: boolean;
}

export const Burger = ({ onClick, stateBurger }: BurgerProps) => {
  return (
    <div onClick={onClick} className={`${module.burger} ${stateBurger && module.active}`}></div>
  );
};
