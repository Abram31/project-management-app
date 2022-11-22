import React from 'react';
import { Board } from './Board/Board';
import { boards } from './exampleBoards';
import module from './PageWIthBoards.module.scss';

export const PageWIthBoards = () => {
  return (
    <section className={module.page_with_boards}>
      <h3 className={module.title_boards}>Your boards</h3>
      <div className={module.boards}>
        {Object.entries(boards).map((board, index) => {
          return <Board key={board[0] + index} descriptionBoard={board[1]} nameBoard={board[0]} />;
        })}
      </div>
    </section>
  );
};
