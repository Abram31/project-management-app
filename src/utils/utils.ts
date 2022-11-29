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
  }, 400);
};

export function getDecodeToken(token: string) {
  if (token) {
    return jwt_decode(token);
  } else {
    return {};
  }
}

export function getLocalStorage(item: string) {
  return localStorage.getItem(item) !== null ? localStorage.getItem(item) || '' : '';
}

export async function request(input: URL | RequestInfo, init: RequestInit) {
  const token = getLocalStorage('token');
  const headers: HeadersInit = new Headers({
    ...init.headers,
  });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return await fetch(input, {
    ...init,
    headers,
  }).then(async (response) => {
    const datares = await response.json();
    if (response.ok) {
      return datares;
    } else {
      throw datares;
    }
  });
}
