import React, { MouseEventHandler, useContext, useState } from 'react';
import { Board } from './Board/Board';
import { BoardsContext } from './context/contextWithBoards';
// import { boards } from './exampleBoards';
import module from './PageWIthBoards.module.scss';

export interface onClickProps {
  event: MouseEventHandler<HTMLDivElement>;
}
interface StateBoardProps {
  [k: string]: { title: string; task: string };
}

export const PageWIthBoards = () => {
  const boards = useContext(BoardsContext);
  const [stateBoards, setStateBoards] = useState<StateBoardProps>(boards);
  const onClick: MouseEventHandler<HTMLDivElement> = (event) => {
    const board = event.nativeEvent.composedPath()[2] as HTMLDivElement;
    const title = (board.querySelector('span') as HTMLHRElement).innerText;
    console.log(event.nativeEvent.composedPath()[2]);

    const filteredElements = Object.fromEntries(
      Object.entries(stateBoards).filter((item) => item[1].title !== title)
    );
    console.log(filteredElements);

    setStateBoards(filteredElements);
  };
  return (
    <section className={module.page_with_boards}>
      <h3 className={module.title_boards}>Your boards</h3>
      <div className={module.boards}>
        {Object.entries(stateBoards).map((board, index) => {
          return (
            <Board
              key={board[0] + index}
              descriptionBoard={board[1]}
              nameBoard={board[0]}
              onClick={onClick}
            />
          );
        })}
      </div>
    </section>
  );
};
