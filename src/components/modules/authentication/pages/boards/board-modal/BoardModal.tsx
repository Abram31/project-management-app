import React, { FormEventHandler } from 'react';

import FormBtn from 'components/modules/authentication/formBtn/FormBtn';

import classes from './boardModal.module.scss';

type Props = {
  title: string;
  isActive: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit?: FormEventHandler<HTMLFormElement>;
  isDetails?: boolean;
  children?: JSX.Element | JSX.Element[];
};

const BoardModal = ({ title, isActive, setActive, handleSubmit, isDetails, children }: Props) => {
  return (
    <div
      className={isActive ? `${classes.overlay} ${classes.active}` : classes.overlay}
      onClick={() => setActive(false)}
    >
      <form
        className={isActive ? `${classes.modal__window} ${classes.active}` : classes.modal__window}
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <h3 className={classes.title}>{title}</h3>
        <div className={classes.input__container}>{children}</div>
        <div className={classes.buttons}>
          <div className={classes.button__box}>
            <button
              className={classes.cancel__button}
              type="reset"
              onClick={() => setActive(false)}
            >
              Cancel
            </button>
          </div>
          {!isDetails && (
            <div className={classes.button__box}>
              <FormBtn>Submit</FormBtn>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default BoardModal;
