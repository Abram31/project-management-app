import React, { memo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './SignIn.module.scss';
import InputField from '../../../common/inputField/InputField';
import { REGEX, ROUTES } from 'constants/constants';
import FormBtn from '../../formBtn/FormBtn';
import { useAppDispatch, useAppSelector } from 'hooks/hooks';
import { setUser } from 'store/authorizationSlice';
import Preloader from '../../../common/preloader/Preloader';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export interface ISignInData {
  login: string;
  password: string;
}
function SignIn() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [formChanged, setFormChanged] = useState(false);
  const { status } = useAppSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignInData>({
    defaultValues: {
      login: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const handleFormSubmit: SubmitHandler<ISignInData> = async (data) => {
    setFormChanged(false);
    const result = await dispatch(setUser(data));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(t('request.logged'), {
        position: toast.POSITION.TOP_CENTER,
        closeButton: true,
      });
    } else if (result.meta.requestStatus === 'rejected') {
      toast.error(result.payload, {
        position: toast.POSITION.TOP_CENTER,
        closeButton: true,
      });
    }
  };

  const handleFormChange = () => {
    setFormChanged(true);
  };

  return (
    <div className={styles.form__box}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        onChange={handleFormChange}
        className={styles.form}
      >
        <h1 className={styles.form__title}>{t('SignIn')}</h1>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>{t('login')}</label>
          <div className={styles.input__box}>
            <InputField
              {...register('login', {
                required: t('errors.requiredErr'),
                pattern: { value: REGEX.login, message: t('errors.loginErr') },
              })}
              error={errors.login?.message}
              name="login"
              type="text"
            />
          </div>
        </div>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>{t('password')}</label>
          <div className={styles.input__box}>
            <InputField
              {...register('password', {
                required: t('errors.requiredErr'),
                pattern: {
                  value: REGEX.password,
                  message: t('errors.passwordErr'),
                },
              })}
              error={errors.password?.message}
              name="password"
              type="password"
            />
          </div>
        </div>
        <div className={styles.form_btn__box}>
          <FormBtn disabled={!formChanged || !!Object.keys(errors).length} type="submit">
            {t('SignIn')}
          </FormBtn>
        </div>
        <p className={styles.form__text}>
          {t('DontHaveAnAccountYet')}
          {'? '}
          <a href={ROUTES.signup} className={styles.form__link}>
            {t('SignUpHere')}
          </a>
        </p>
      </form>
      {status === 'loading' && <Preloader />}
    </div>
  );
}

export default memo(SignIn);
