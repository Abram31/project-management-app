import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getDecodeToken, getLocalStorage } from '../utils/utils';

interface IUserData {
  token: string;
  userId: string;
  login: string;
  iat: string;
}

const token = getLocalStorage('token');
const userData = getDecodeToken(token) as IUserData;

const initialState: IUserData = {
  token: token,
  userId: userData.userId || '',
  login: userData.login || '',
  iat: userData.iat || '',
};

const authorizationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      const data = getDecodeToken(action.payload) as IUserData;
      state.userId = data.userId || '';
      state.login = data.login || '';
      state.iat = data.iat || '';
    },
    removeUserData: (state) => {
      state.token = '';
      state.userId = '';
      state.login = '';
      state.iat = '';
      localStorage.removeItem('token');
    },
  },
});

export const { setUserData, removeUserData } = authorizationSlice.actions;
export default authorizationSlice;
