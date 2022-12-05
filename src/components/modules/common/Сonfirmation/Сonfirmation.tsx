import FormBtn from 'components/modules/authentication/formBtn/FormBtn';
import React, { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import module from './Confirmation.module.scss';
interface IСonfirmationProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
}

export const Сonfirmation = (props: IСonfirmationProps) => {
  const { t } = useTranslation();
  return (
    <div id="confirmation_wrapper" className={module.confirmation_wrapper}>
      <form className={module.confirmation_window}>
        <h3 className={module.confirmation_window__title}>{props.children}</h3>
        <div className={module.wrapper__submit_button}>
          <FormBtn id="confirm" onClick={props.onClick} disabled={false} type="button">
            {t('Yes')}
          </FormBtn>
          <FormBtn id="unconfirm" onClick={props.onClick} disabled={false} type="button">
            {t('Cancel')}
          </FormBtn>
        </div>
      </form>
    </div>
  );
};
