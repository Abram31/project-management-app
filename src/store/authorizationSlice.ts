import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ISignInData } from 'components/modules/authentication/pages/signIn/SignIn';
import { URLS } from 'constants/constants';
import { Id, toast } from 'react-toastify';
import { getDecodeToken, getLocalStorage, updateToast } from '../utils/utils';

let toastLogin: Id;
interface IUserData {
  token: string;
  userId: string;
  login: string;
  iat: string;
  name: string;
  status: string;
}

const token = getLocalStorage('token');
const userData = getDecodeToken(token) as IUserData;

const initialState: IUserData = {
  token: token,
  userId: userData.userId || '',
  login: userData.login || '',
  iat: userData.iat || '',
  name: '',
  status: '',
};

export const setUser = createAsyncThunk<string, ISignInData, { rejectValue: string }>(
  'user/createUser',
  async function (data, { rejectWithValue }) {
    return await fetch(URLS.signin, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        const datares = await response.json();
        if (response.ok) {
          return datares.token as string;
        } else {
          throw datares;
        }
      })
      .catch((error) => {
        if (error.statusCode === 403) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue('Something went wrong. Please try again.');
        }
      });
  }
);

export const getUserName = createAsyncThunk<
  string,
  undefined,
  { rejectValue: string; state: { user: IUserData } }
>('user/getUserName', async function (_, { rejectWithValue, dispatch, getState }) {
  return await fetch(`${URLS.users}/${getState().user.userId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getState().user.token}`,
    },
  })
    .then(async (response) => {
      const datares = await response.json();
      if (response.ok) {
        return datares.name as string;
      } else {
        throw datares;
      }
    })
    .catch((error) => {
      if (error.statusCode === 403) {
        dispatch(removeUserData());
        return rejectWithValue('Please log in again.');
      } else {
        return rejectWithValue('Something went wrong.');
      }
    });
});

const authorizationSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    removeUserData: (state) => {
      state.token = '';
      state.userId = '';
      state.login = '';
      state.iat = '';
      localStorage.removeItem('token');
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setUser.pending, (state) => {
      state.status = 'loading';
      toastLogin = toast.loading('Please wait...', {
        position: toast.POSITION.TOP_CENTER,
        closeButton: true,
        autoClose: false,
      });
    });
    builder.addCase(setUser.fulfilled, (state, action) => {
      console.log(action);
      state.status = 'fulfilled';
      updateToast(toastLogin, 'You have successfully logged in!', 'success');
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      const data = getDecodeToken(action.payload) as IUserData;
      state.userId = data.userId || '';
      state.login = data.login || '';
      state.iat = data.iat || '';
    });
    builder.addCase(setUser.rejected, (state, action) => {
      state.status = 'error';
      updateToast(toastLogin, action.payload || '', 'error');
    });
    builder.addCase(getUserName.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getUserName.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.name = action.payload;
    });
    builder.addCase(getUserName.rejected, (state, action) => {
      state.status = 'error';
      toast.error(action.payload || '');
    });
  },
});

export const { removeUserData } = authorizationSlice.actions;
export default authorizationSlice;
