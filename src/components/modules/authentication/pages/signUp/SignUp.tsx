import React, { memo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './SignUp.module.scss';
import InputField from '../../../common/inputField/InputField';
import { ERROR_TEXT, REGEX, REQUEST_ERRORS, ROUTES, URLS } from 'constants/constants';
import FormBtn from '../../formBtn/FormBtn';
import { toast } from 'react-toastify';
import { updateToast } from 'utils/utils';
import Preloader from '../../../common/preloader/Preloader';

export interface ISignUpData {
  name: string;
  login: string;
  password: string;
}
function SignUp() {
  const [formChanged, setFormChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ISignUpData>({
    defaultValues: {
      name: '',
      login: '',
      password: '',
    },
    mode: 'onChange',
  });

  const handleFormSubmit: SubmitHandler<ISignUpData> = async (data) => {
    setFormChanged(false);
    setLoading(true);
    const toastAuth = toast.loading('Please wait...', {
      position: toast.POSITION.TOP_CENTER,
      closeButton: true,
      autoClose: false,
    });
    fetch(URLS.signup, {
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
          reset();
          updateToast(toastAuth, 'You have successfully registered!', 'success');
        } else {
          throw data;
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.statusCode === 409) {
          updateToast(toastAuth, error.message, 'error');
        } else {
          updateToast(toastAuth, REQUEST_ERRORS.common, 'error');
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
        <h1 className={styles.form__title}>Sign Up</h1>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>Name</label>
          <div className={styles.input__box}>
            <InputField
              {...register('name', {
                required: ERROR_TEXT.required,
                pattern: { value: REGEX.name, message: ERROR_TEXT.userName },
              })}
              error={errors.name?.message}
              name="name"
              type="text"
            />
          </div>
        </div>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>Login</label>
          <div className={styles.input__box}>
            <InputField
              {...register('login', {
                required: ERROR_TEXT.required,
                pattern: { value: REGEX.login, message: ERROR_TEXT.login },
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
          <FormBtn disabled={!formChanged || !isValid} type="submit">
            Sign Up
          </FormBtn>
        </div>
        <p className={styles.form__text}>
          Already have an account?{' '}
          <a href={ROUTES.signin} className={styles.form__link}>
            Sign in here
          </a>
        </p>
      </form>
      {loading && <Preloader />}
    </div>
  );
}

export default memo(SignUp);
