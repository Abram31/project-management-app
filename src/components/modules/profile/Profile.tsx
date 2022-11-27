import React, { useEffect, useState } from 'react';
import { useAppSelector, useAuthUser } from 'hooks/hooks';
import ky, { HTTPError } from 'ky';
import { getUserName, removeUserData } from 'store/authorizationSlice';
import { useAppDispatch } from 'hooks/hooks';
import Preloader from '../common/preloader/Preloader';
import { toast } from 'react-toastify';
import { updateToast } from 'utils/utils';
import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '../common/inputField/InputField';
import FormBtn from '../authentication/formBtn/FormBtn';
import { ERROR_TEXT, REGEX, URLS } from 'constants/constants';
import styles from './Profile.module.scss';

interface IProfileData {
  name: string;
  login: string;
  password: string;
}
function Profile() {
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

  /*useEffect(() => {
    reset({
      name: name,
    });
  }, [name]);*/

  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [status]);

  async function handleDeleteAccount() {
    setLoading(true);
    const toastDelete = toast.loading('Please wait...', {
      position: toast.POSITION.TOP_CENTER,
      closeButton: true,
      autoClose: false,
    });
    await fetch(`https://react-final-task.herokuapp.com/users/${user.userId}`, {
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
          setLoading(false);
          dispatch(removeUserData());
          updateToast(toastDelete, 'You account successfully deleted!', 'success');
        } else {
          const err = await response.json();
          throw err;
        }
      })
      .catch((error) => {
        setLoading(false);
        if (error.statusCode === 403) {
          dispatch(removeUserData());
          updateToast(toastDelete, error.message, 'warning');
        } else if (error.statusCode === 404) {
          updateToast(toastDelete, error.message, 'error');
        } else {
          updateToast(toastDelete, 'Something went wrong. Please try again.', 'error');
        }
      });
  }

  const handleFormSubmit: SubmitHandler<IProfileData> = async (data) => {
    setFormChanged(false);
    setLoading(true);
    const toastAuth = toast.loading('Please wait...', {
      position: toast.POSITION.TOP_CENTER,
      closeButton: true,
      autoClose: false,
    });
    fetch(`https://react-final-task.herokuapp.com/users/${user.userId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          console.log(data);
          updateToast(toastAuth, 'You data changed!', 'success');
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
    <div>
      <button type="button" onClick={handleDeleteAccount}>
        Delete account
      </button>
      <div className={styles.form__box}>
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          onChange={handleFormChange}
          className={styles.form}
        >
          <h1 className={styles.form__title}>Edit Profile</h1>
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
              Save
            </FormBtn>
          </div>
        </form>
      </div>
      {loading && <Preloader />}
    </div>
  );
}

export default Profile;
