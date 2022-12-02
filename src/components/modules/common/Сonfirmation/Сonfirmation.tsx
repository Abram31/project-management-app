import FormBtn from 'components/modules/authentication/formBtn/FormBtn';
import React, { MouseEventHandler } from 'react';
import module from './Confirmation.module.scss';

export const Сonfirmation = ({ onClick }: { onClick: MouseEventHandler<HTMLButtonElement> }) => {
  return (
    <div id="confirmation_wrapper" className={module.confirmation_wrapper}>
      <form className={module.confirmation_window}>
        <h3 className={module.confirmation_window__title}>
          Вы действительно хотите удалить доску?
        </h3>
        <div className={module.wrapper__submit_button}>
          <FormBtn id="confirm" onClick={onClick} disabled={false} type="submit">
            ДА
          </FormBtn>
          <FormBtn id="unconfirm" onClick={onClick} disabled={false} type="submit">
            ОТМЕНА
          </FormBtn>
        </div>
      </form>
    </div>
  );
};
