import React, { memo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './SignIn.module.scss';
import InputField from '../../inputField/InputField';
import { ERROR_TEXT, REGEX, ROUTES, URLS } from 'constants/constants';
import FormBtn from '../../formBtn/FormBtn';
import { toast } from 'react-toastify';
import { updateToast } from 'utils/utils';
import { useAppDispatch } from 'hooks/hooks';
import { setUserData } from 'store/authorizationSlice';
import Preloader from '../../preloader/Preloader';

interface ISignInData {
  login: string;
  password: string;
}
function SignIn() {
  const dispatch = useAppDispatch();
  const [formChanged, setFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignInData>({
    defaultValues: {
      login: '',
      password: '',
    },
    mode: 'onSubmit',
  });

  const handleFormSubmit: SubmitHandler<ISignInData> = async (data) => {
    setFormChanged(false);
    setLoading(true);
    const toastAuth = toast.loading('Please wait...', {
      position: toast.POSITION.TOP_CENTER,
      closeButton: true,
      autoClose: false,
    });

    fetch(URLS.signin, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          dispatch(setUserData(data.token));
          reset();
          updateToast(toastAuth, 'You have successfully logged in!', 'success');
        } else {
          throw data;
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.statusCode === 403) {
          updateToast(toastAuth, error.message, 'error');
        } else {
          updateToast(toastAuth, 'Something went wrong. Please try again.', 'error');
        }
      });
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
      {loading && <Preloader />}
    </div>
  );
}

export default memo(SignIn);
