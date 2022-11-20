import { Id, toast, TypeOptions } from 'react-toastify';
import jwt_decode from 'jwt-decode';

export const updateToast = (toastId: Id, message: string, type: TypeOptions) => {
  setTimeout(() => {
    toast.update(toastId, {
      render: message,
      type: type,
      isLoading: false,
      autoClose: 3000,
    });
  }, 100);
};

export function getDecodeToken(token: string) {
  if (token) {
    return jwt_decode(token);
  } else {
    return {};
  }
}

export function getLocalStorage(item: string) {
  return localStorage.getItem(item) !== null
    ? JSON.stringify(localStorage.getItem(item) || '')
    : '';
}
