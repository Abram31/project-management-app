import FormBtn from 'components/modules/authentication/formBtn/FormBtn';
import InputField from 'components/modules/common/inputField/InputField';
import { URLS } from 'constants/constants';
import { fetchRequest } from 'fetch/fetchRequest';
import { useAppDispatch } from 'hooks/hooks';
import React, { FormEventHandler, MouseEventHandler } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { BorderData, setBoard } from 'store/boardsSlice';
import store from 'store/store';
import module from './ModalWindowNewBoard.module.scss';

interface ModalWindowNewBoardProps {
  onClick: MouseEventHandler<HTMLDivElement>;
  closeModal: () => void;
}
export const ModalWindowNewBoard = ({ onClick, closeModal }: ModalWindowNewBoardProps) => {
  const { register, getValues } = useForm();
  const dispatch = useAppDispatch();

  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const { board_description, board_title } = getValues();
    fetchRequest({
      method: 'POST',
      URL: URLS.boards,
      token: localStorage.getItem('token')!,
      bodyParams: { title: board_title, description: board_description },
    }).then(({ description, title, id }: BorderData) => {
      dispatch(setBoard({ title: title, description: description, id: id }));
    });
    closeModal();
  };
  return (
    <div id="modal_wrapper" onClick={onClick} className={module.wrapper__modal_window}>
      <form className={module.modal_window} onSubmit={onSubmit}>
        <h3 className={module.modal_window__title}>Create board</h3>
        <div className={module.wrapper__input_board_title}>
          <label htmlFor="board_title">BOARD TITLE</label>
          <InputField {...register('board_title')} id="board_title" />
        </div>
        <div className={module.wrapper__input_board_description}>
          <label htmlFor="board_description">BOARD DESCRIPTION</label>
          <InputField {...register('board_description')} id="board_description" />
        </div>
        <div className={module.wrapper__submit_button}>
          <FormBtn disabled={false} type="submit">
            CREATE
          </FormBtn>
        </div>
      </form>
    </div>
  );
};
