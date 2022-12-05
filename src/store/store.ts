import { configureStore } from '@reduxjs/toolkit';
import authorizationSlice from './authorizationSlice';
import boardSlice from './boardsSlice';
import localizationSlice from './localizationSlice';

const store = configureStore({
  reducer: {
    lang: localizationSlice,
    user: authorizationSlice,
    boarders: boardSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
