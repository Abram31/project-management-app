import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';

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
