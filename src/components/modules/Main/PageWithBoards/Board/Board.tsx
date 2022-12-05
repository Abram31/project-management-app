import React, { MouseEventHandler } from 'react';
import module from './Board.module.scss';

interface BoardProps {
  nameBoard: string;
  descriptionBoard: {
    id: string;
    title: string;
    description: string;
  };
  onClick?: MouseEventHandler<HTMLDivElement>;
}

export const Board = ({ descriptionBoard }: BoardProps) => {
  return (
    <div className={module.boards__board} id={descriptionBoard.id}>
      <span className={module.board__title}>{descriptionBoard.title}</span>
      <p className={module.board__description}>{descriptionBoard.description}</p>
    </div>
  );
};
