import { Button } from 'components/modules/common/Button/Button';
import { ButtonDeleteBasket } from 'components/modules/common/ButtonDeleteBasket/ButtonDeleteBasket';
import Preloader from 'components/modules/common/preloader/Preloader';
import { Сonfirmation } from 'components/modules/common/Сonfirmation/Сonfirmation';
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
import { toast } from 'react-toastify';

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
  const [confirmation, setСonfirmation] = useState(false);
  const [boardID, setBoardID] = useState('');

  const dispatch = useAppDispatch();
  const boards = useSelector((state: StateData) => state.boarders);

  const closeAddBoard = () => {
    const body = document.querySelector('body') as HTMLBodyElement;
    body.classList.remove('active_modal'), setStateModalNewBoard(!stateModalNewBoard);
  };
  const onClickDelete: MouseEventHandler<HTMLDivElement> = (event) => {
    event.stopPropagation();
    setСonfirmation(true);
    const board = event.nativeEvent.composedPath()[2] as HTMLDivElement;
    const id = (board.closest('div') as HTMLHRElement).id;
    setBoardID(id);
  };

  const onClickСonfirmation: MouseEventHandler<HTMLButtonElement> = (event) => {
    const element = event.target as HTMLButtonElement;

    if (element.id === 'unconfirm') {
      setСonfirmation(false);
    } else {
      setLoading(false);
      fetchRequest({
        method: 'DELETE',
        token: localStorage.getItem('token')!,
        URL: `${URLS.boards}/${boardID}`,
      })
        .then(() => {
          toast.success(t('BoardDeleted'), {
            toastId: 'getUserName',
            position: toast.POSITION.TOP_CENTER,
            closeButton: true,
          });
          dispatch(removeBoard(boardID));
        })
        .catch(() => {
          toast.error(t('boardNotRemoved'), {
            toastId: 'getUserName',
            position: toast.POSITION.TOP_CENTER,
            closeButton: true,
          });
        })
        .finally(() => {
          setLoading(false);
        });
      setСonfirmation(false);
    }
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
    })
      .then((data) => {
        dispatch(setBoards(data));
      })
      .catch(() => {
        toast.error(t('SomethingWentWrong'), {
          toastId: 'getUserName',
          position: toast.POSITION.TOP_CENTER,
          closeButton: true,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  return (
    <>
      <section className={module.page_with_boards}>
        <h3 className={module.title_boards}>{t('YourBoards')}</h3>
        <div>
          <Button
            borderColor="rgba(157, 164, 172, 1)"
            colorText="whitesmoke"
            title={t('NewBoard')}
            pathLink=""
            onClick={onClickAddBoard}
          />
        </div>
        <div className={module.boards}>
          {boards &&
            Object.entries(boards).map((board, index) => {
              return (
                <div className={module.wrapper_board_button} key={board[0]} id={board[1].id}>
                  <Link key={board[0]} to={`${ROUTES.boards}/${board[0]}`}>
                    <Board
                      key={board[0] + index}
                      descriptionBoard={board[1]}
                      nameBoard={board[0]}
                      onClick={onClickDelete}
                    />
                  </Link>
                  <div className={module.wrapper__button_delete}>
                    <ButtonDeleteBasket onClick={onClickDelete} />
                  </div>
                </div>
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
      {confirmation && (
        <Сonfirmation onClick={onClickСonfirmation}>{t('deleteBoardQuestion')}</Сonfirmation>
      )}
    </>
  );
};
