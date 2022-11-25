import React, { MouseEventHandler } from 'react';
import module from './Board.module.scss';
import { ButtonDeleteBasket } from '../../../common/ButtonDeleteBasket/ButtonDeleteBasket';

interface BoardProps {
  nameBoard: string;
  descriptionBoard: {
    id: string;
    title: string;
    description: string;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Board = ({ descriptionBoard, onClick }: BoardProps) => {
  return (
    <div className={module.boards__board} id={descriptionBoard.id}>
      <span className={module.board__title}>{descriptionBoard.title}</span>
      <p className={module.board__description}>{descriptionBoard.description}</p>
      <div className={module.wrapper__button_delete}>
        <ButtonDeleteBasket onClick={onClick} />
      </div>
    </div>
  );
};
