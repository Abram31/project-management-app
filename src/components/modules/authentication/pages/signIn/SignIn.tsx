import React, { memo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './SignIn.module.scss';
import InputField from '../../../common/inputField/InputField';
import { ERROR_TEXT, REGEX, ROUTES } from 'constants/constants';
import FormBtn from '../../formBtn/FormBtn';
import { useAppDispatch, useAppSelector } from 'hooks/hooks';
import { setUser } from 'store/authorizationSlice';
import Preloader from '../../../common/preloader/Preloader';
import { toast } from 'react-toastify';

export interface ISignInData {
  login: string;
  password: string;
}
function SignIn() {
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
      toast.success('You have successfully logged in!', {
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
        <h1 className={styles.form__title}>Sign In</h1>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>Login</label>
          <div className={styles.input__box}>
            <InputField
              {...register('login', {
                required: ERROR_TEXT.required,
                pattern: { value: REGEX.login, message: ERROR_TEXT.userName },
              })}
              error={errors.login?.message}
              name="login"
              type="text"
            />
          </div>
        </div>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>Password</label>
          <div className={styles.input__box}>
            <InputField
              {...register('password', {
                required: ERROR_TEXT.required,
                pattern: {
                  value: REGEX.password,
                  message: ERROR_TEXT.password,
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
            Sign In
          </FormBtn>
        </div>
        <p className={styles.form__text}>
          Don&apos;t have an account yet?{' '}
          <a href={ROUTES.signup} className={styles.form__link}>
            Sign up here
          </a>
        </p>
      </form>
      {status === 'loading' && <Preloader />}
    </div>
  );
}

export default memo(SignIn);
