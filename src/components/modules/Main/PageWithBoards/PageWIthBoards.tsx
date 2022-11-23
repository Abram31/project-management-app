import { Button } from 'components/modules/common/Button/Button';
import { URLS } from 'constants/constants';
import { fetchRequest } from 'fetch/fetchRequest';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Board } from './Board/Board';
import { ModalWindowNewBoard } from './ModalWindowNewBoard/ModalWindowNewBoard';
import module from './PageWIthBoards.module.scss';

export interface onClickProps {
  event: MouseEventHandler<HTMLDivElement>;
}
interface StateBoardProps {
  [k: string]: { title: string; description: string; id: string };
}

export const PageWIthBoards = () => {
  const [stateBoards, setStateBoards] = useState<StateBoardProps>();
  const [stateModalNewBoard, setStateModalNewBoard] = useState(false);

  const closeAddBoard = () => {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.classList.remove('active_modal'), setStateModalNewBoard(!stateModalNewBoard);
  };
  const onClickDelete: MouseEventHandler<HTMLDivElement> = (event) => {
    const board = event.nativeEvent.composedPath()[2] as HTMLDivElement;
    const id = (board.closest('div') as HTMLHRElement).id;
    console.log(event.nativeEvent.composedPath()[2]);

    const filteredElements = Object.fromEntries(
      Object.entries(stateBoards!).filter((item) => item[1].id !== id)
    );
    fetchRequest({
      method: 'DELETE',
      token: localStorage.getItem('token')!,
      URL: `${URLS.boards}/${id}`,
    });
    console.log(localStorage.getItem('token'));

    setStateBoards(filteredElements);
  };

  const onClickAddBoard: MouseEventHandler<HTMLAnchorElement> = (event) => {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.classList.add('active_modal');
    setStateModalNewBoard(!stateModalNewBoard);
  };
  const onClickCloseAddBoard: MouseEventHandler<HTMLDivElement> = (event) => {
    (event.target as HTMLDivElement).id === 'modal_wrapper' && closeAddBoard();
  };
  useEffect(() => {
    fetchRequest({
      method: 'GET',
      token: localStorage.getItem('token')!,
      URL: URLS.boards,
    }).then((data) => {
      console.log(data);
      setStateBoards(data);
    });
  }, [stateModalNewBoard]);

  return (
    <>
      <section className={module.page_with_boards}>
        <h3 className={module.title_boards}>Your Boards</h3>
        <Button
          borderColor="rgba(157, 164, 172, 1)"
          colorText="whitesmoke"
          title="New Board"
          pathLink=""
          onClick={onClickAddBoard}
        />
        <div className={module.boards}>
          {stateBoards &&
            Object.entries(stateBoards).map((board, index) => {
              return (
                <Board
                  key={board[0] + index}
                  descriptionBoard={board[1]}
                  nameBoard={board[0]}
                  onClick={onClickDelete}
                />
              );
            })}
        </div>
      </section>
      {stateModalNewBoard && (
        <ModalWindowNewBoard onClick={onClickCloseAddBoard} closeModal={closeAddBoard} />
      )}
    </>
  );
};
