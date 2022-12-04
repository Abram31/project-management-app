import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useAuthUser() {
  const { token, userId, login, iat, relogin } = useAppSelector((state) => state.user);

  return {
    user: {
      token,
      userId,
      login,
      iat,
      relogin,
    },
    userExist: token && userId && login && iat,
  };
}
