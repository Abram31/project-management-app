import { configureStore } from '@reduxjs/toolkit';
import authorizationSlice from './authorizationSlice';

const store = configureStore({
  reducer: {
    user: authorizationSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
