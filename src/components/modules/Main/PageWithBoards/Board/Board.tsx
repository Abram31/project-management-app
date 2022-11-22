import React, { MouseEventHandler } from 'react';
import module from './Board.module.scss';
import { ButtonDeleteBasket } from '../../../common/ButtonDeleteBasket/ButtonDeleteBasket';
import { onClickProps } from '../PageWIthBoards';

interface BoardProps {
  nameBoard: string;
  descriptionBoard: {
    title: string;
    task: string;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Board = ({ nameBoard, descriptionBoard, onClick }: BoardProps) => {
  return (
    <div className={module.boards__board}>
      <span className={module.board__title}>{descriptionBoard.title}</span>
      <p className={module.board__description}>{descriptionBoard.task}</p>
      <div className={module.wrapper__button_delete}>
        <ButtonDeleteBasket onClick={onClick} />
      </div>
    </div>
  );
};
