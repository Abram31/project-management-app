import React, { useEffect, useState } from 'react';
import { useAppSelector, useAuthUser } from 'hooks/hooks';
import { getUserName, removeUserData, setRelogin } from 'store/authorizationSlice';
import { useAppDispatch } from 'hooks/hooks';
import Preloader from '../common/preloader/Preloader';
import { toast } from 'react-toastify';
import { request, updateToast } from 'utils/utils';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../common/inputField/InputField';
import FormBtn from '../authentication/formBtn/FormBtn';
import { REGEX, URLS } from 'constants/constants';
import styles from './Profile.module.scss';

import '../../../i18n/config';
import { useTranslation } from 'react-i18next';
interface IProfileData {
  name: string;
  login: string;
  password: string;
}
function Profile() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { user } = useAuthUser();
  const [loading, setLoading] = useState(false);
  const [formChanged, setFormChanged] = useState(false);
  const { name } = useAppSelector((state) => state.user);
  const { status } = useAppSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<IProfileData>({
    defaultValues: {
      name: name,
      login: user.login,
      password: '',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    dispatch(getUserName());
  }, [dispatch]);

  useEffect(() => {
    reset({
      name: name,
    });
  }, [reset, name]);

  async function handleDeleteAccount() {
    setLoading(true);
    const toastDelete = toast.loading(t('request.wait'), {
      position: toast.POSITION.TOP_CENTER,
      closeButton: true,
      autoClose: false,
    });
    await fetch(`${URLS.users}/${user.userId}`, {
      method: 'DELETE',
      headers: {
        accept: '*/*',
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user.userId),
    })
      .then(async (response) => {
        if (response.ok) {
          dispatch(removeUserData());
          updateToast(toastDelete, t('request.accountDeleted'), 'success');
          setLoading(false);
        } else {
          throw await response.json();
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.statusCode === 403) {
          dispatch(removeUserData());
          dispatch(setRelogin(true));
          updateToast(toastDelete, t('request.reloginErr'), 'error');
        } else if (error.statusCode === 404) {
          updateToast(toastDelete, error.message, 'error');
        } else {
          updateToast(toastDelete, t('request.commonErr'), 'error');
        }
      });
  }

  const handleFormSubmit: SubmitHandler<IProfileData> = async (data) => {
    setFormChanged(false);
    setLoading(true);
    const toastAuth = toast.loading(t('request.wait'), {
      position: toast.POSITION.TOP_CENTER,
      closeButton: true,
      autoClose: false,
    });
    return request(`${URLS.users}/${user.userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(() => {
        setLoading(false);
        updateToast(toastAuth, t('request.dataChanged'), 'success');
        dispatch(removeUserData());
        dispatch(setRelogin(true));
      })
      .catch((error) => {
        setLoading(false);
        if (error.statusCode === 403) {
          dispatch(removeUserData());
          dispatch(setRelogin(true));
          updateToast(toastAuth, t('request.reloginErr'), 'error');
        } else {
          updateToast(toastAuth, t('request.commonErr'), 'error');
        }
      });
  };

  const handleFormChange = () => {
    setFormChanged(true);
  };

  return (
    <div className={styles.profile}>
      <h1 className={styles.profile__title}>{t('profile')}</h1>
      <div className={styles.profile__inner}>
        <div>
          <ul className={styles.profile__info}>
            <li className={styles.profile__info_item}>
              {t('name')}: <span>{name}</span>
            </li>
            <li className={styles.profile__info_item}>
              {t('login')}: <span>{user.login}</span>
            </li>
            <li className={styles.profile__info_item}>
              {t('id')}: <span>{user.userId}</span>
            </li>
          </ul>
          <button
            className={styles.profile__delete_btn}
            type="button"
            onClick={handleDeleteAccount}
          >
            {t('deleteAccount')}
          </button>
        </div>
        <div className={styles.form__box}>
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            onChange={handleFormChange}
            className={styles.form}
          >
            <h1 className={styles.form__title}>{t('editProfile')}</h1>
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
                {t('save')}
              </FormBtn>
            </div>
          </form>
        </div>
      </div>
      {(status === 'loading' || loading) && <Preloader />}
    </div>
  );
}

export default Profile;
