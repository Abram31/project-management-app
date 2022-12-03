import { Button } from 'components/modules/common/Button/Button';
import Preloader from 'components/modules/common/preloader/Preloader';
import { URLS } from 'constants/constants';
import { ROUTES } from 'constants/constants';
import { fetchRequest } from 'fetch/fetchRequest';
import { useAppDispatch } from 'hooks/hooks';
import React, { MouseEventHandler, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeBoard, setBoards, StateData } from 'store/boardsSlice';
import { Board } from './Board/Board';
import { ModalWindowNewBoard } from './ModalWindowNewBoard/ModalWindowNewBoard';
import module from './PageWIthBoards.module.scss';
import { useTranslation } from 'react-i18next';

export interface onClickProps {
  event: MouseEventHandler<HTMLDivElement>;
}
export interface StateBoardProps {
  [k: string]: { title: string; description: string; id: string };
}

export const PageWIthBoards = () => {
  const { t } = useTranslation();
  const [stateModalNewBoard, setStateModalNewBoard] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const boards = useSelector((state: StateData) => state.boarders);

  const closeAddBoard = () => {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.classList.remove('active_modal'), setStateModalNewBoard(!stateModalNewBoard);
  };
  const onClickDelete: MouseEventHandler<HTMLDivElement> = (event) => {
    const board = event.nativeEvent.composedPath()[2] as HTMLDivElement;
    const id = (board.closest('div') as HTMLHRElement).id;

    fetchRequest({
      method: 'DELETE',
      token: localStorage.getItem('token')!,
      URL: `${URLS.boards}/${id}`,
    });
    dispatch(removeBoard(id));
  };

  const onClickAddBoard: MouseEventHandler<HTMLAnchorElement> = () => {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.classList.add('active_modal');
    setStateModalNewBoard(!stateModalNewBoard);
  };
  const onClickCloseAddBoard: MouseEventHandler<HTMLDivElement> = (event) => {
    (event.target as HTMLDivElement).id === 'modal_wrapper' && closeAddBoard();
  };
  useEffect(() => {
    setLoading(true);
    fetchRequest({
      method: 'GET',
      token: localStorage.getItem('token')!,
      URL: URLS.boards,
    }).then((data) => {
      dispatch(setBoards(data));
      setLoading(false);
    });
  }, [dispatch]);

  return (
    <>
      <section className={module.page_with_boards}>
        <h3 className={module.title_boards}>{t('YourBoards')}</h3>
        <Button
          borderColor="rgba(157, 164, 172, 1)"
          colorText="whitesmoke"
          title={t('NewBoard')}
          pathLink=""
          onClick={onClickAddBoard}
        />
        <div className={module.boards}>
          {boards &&
            Object.entries(boards).map((board, index) => {
              return (
                <Link key={board[0]} to={`${ROUTES.boards}/${board[0]}`}>
                  <Board
                    key={board[0] + index}
                    descriptionBoard={board[1]}
                    nameBoard={board[0]}
                    onClick={onClickDelete}
                  />
                </Link>
              );
            })}
        </div>
        {loading && <Preloader />}
      </section>
      {stateModalNewBoard && (
        <ModalWindowNewBoard
          onClick={onClickCloseAddBoard}
          closeModal={closeAddBoard}
          setLoading={setLoading}
        />
      )}
    </>
  );
};
