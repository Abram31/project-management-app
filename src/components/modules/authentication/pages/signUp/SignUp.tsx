import React, { memo, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import styles from './SignUp.module.scss';
import InputField from '../../../common/inputField/InputField';
import { REGEX, ROUTES, URLS } from 'constants/constants';
import FormBtn from '../../formBtn/FormBtn';
import { toast } from 'react-toastify';
import { updateToast } from 'utils/utils';
import Preloader from '../../../common/preloader/Preloader';
import { useTranslation } from 'react-i18next';
import FormTitle from 'components/modules/common/formTitle/FormTitle';

export interface ISignUpData {
  name: string;
  login: string;
  password: string;
}
function SignUp() {
  const { t } = useTranslation();
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
    const toastAuth = toast.loading(t('request.wait'), {
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
          updateToast(toastAuth, t('request.registered'), 'success');
        } else {
          throw data;
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.statusCode === 409) {
          updateToast(toastAuth, error.message, 'error');
        } else {
          updateToast(toastAuth, t('request.commonErr'), 'error');
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
        <FormTitle>{t('SignUp')}</FormTitle>
        <div className={styles.form_item}>
          <label className={styles.form_item__label}>{t('name')}</label>
          <div className={styles.input__box}>
            <InputField
              {...register('name', {
                required: t('errors.requiredErr'),
                pattern: { value: REGEX.name, message: t('errors.userNameErr') },
              })}
              error={errors.name?.message}
              name="name"
              type="text"
            />
          </div>
        </div>
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
          <FormBtn disabled={!formChanged || !isValid} type="submit">
            {t('SignUp')}
          </FormBtn>
        </div>
        <p className={styles.form__text}>
          {t('AlreadyHaveAnAccount')}
          {'? '}
          <a href={ROUTES.signin} className={styles.form__link}>
            {t('SignInHere')}
          </a>
        </p>
      </form>
      {loading && <Preloader />}
    </div>
  );
}

export default memo(SignUp);
