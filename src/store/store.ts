import { configureStore } from '@reduxjs/toolkit';
import authorizationSlice from './authorizationSlice';
import boardSlice from './boardsSlice';

const store = configureStore({
  reducer: {
    user: authorizationSlice.reducer,
    boarders: boardSlice.reducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
