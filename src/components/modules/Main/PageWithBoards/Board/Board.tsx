import React from 'react';
import module from './Board.module.scss';

interface BoardProps {
  nameBoard: string;
  descriptionBoard: {
    title: string;
    task: string;
  };
}

export const Board = ({ nameBoard, descriptionBoard }: BoardProps) => {
  return (
    <div className={module.boards__board}>
      <span className={module.board__title}>{descriptionBoard.title}</span>
      <p className={module.board__description}>{descriptionBoard.task}</p>
      <div className={module.board__button_delete}></div>
    </div>
  );
};
