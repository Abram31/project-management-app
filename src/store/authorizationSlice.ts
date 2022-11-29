import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ISignInData } from 'components/modules/authentication/pages/signIn/SignIn';
import { REQUEST_ERRORS, URLS } from 'constants/constants';
import { toast } from 'react-toastify';
import { getDecodeToken, getLocalStorage, request } from '../utils/utils';
interface IUserData {
  token: string;
  userId: string;
  login: string;
  iat: string;
  name: string;
  status: string;
  relogin: boolean;
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
  relogin: false,
};

export const setUser = createAsyncThunk<string, ISignInData, { rejectValue: string }>(
  'user/createUser',
  async function (data, { rejectWithValue }) {
    return request(URLS.signin, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((datares) => datares.token)
      .catch((error) => {
        if (error.statusCode === 403) {
          return rejectWithValue(error.message);
        } else {
          return rejectWithValue(REQUEST_ERRORS.common);
        }
      });
  }
);

export const getUserName = createAsyncThunk<
  string,
  undefined,
  { rejectValue: string; state: { user: IUserData } }
>('user/getUserName', async function (_, { rejectWithValue, dispatch, getState }) {
  return request(`${URLS.users}/${getState().user.userId}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then((datares) => datares.name)
    .catch((error) => {
      if (error.statusCode === 403) {
        dispatch(removeUserData());
        return rejectWithValue(REQUEST_ERRORS.relogin);
      } else {
        return rejectWithValue('An error occurred while loading the data.');
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
    setRelogin: (state, action) => {
      state.relogin = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(setUser.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(setUser.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
      const data = getDecodeToken(action.payload) as IUserData;
      state.userId = data.userId || '';
      state.login = data.login || '';
      state.iat = data.iat || '';
    });
    builder.addCase(setUser.rejected, (state, action) => {
      state.status = 'rejected';
    });
    builder.addCase(getUserName.pending, (state) => {
      state.status = 'loading';
    });
    builder.addCase(getUserName.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.name = action.payload;
    });
    builder.addCase(getUserName.rejected, (state, action) => {
      state.status = 'rejected';
      toast.error(action.payload || '', { toastId: 'getUserName' });
    });
  },
});

export const { removeUserData, setRelogin } = authorizationSlice.actions;
export default authorizationSlice;
