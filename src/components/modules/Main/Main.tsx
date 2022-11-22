import React from 'react';
import module from './Main.module.scss';
import { BoardsContext } from './PageWithBoards/context/contextWithBoards';
import { boards } from './PageWithBoards/exampleBoards';
import { WelcomPage } from './WelcomPage/WelcomPage';

interface MainProps {
  children: React.ReactNode;
}
export const Main = ({ children }: MainProps) => {
  return (
    <main className={module.main}>
      <BoardsContext.Provider value={boards}>{children}</BoardsContext.Provider>
    </main>
  );
};
