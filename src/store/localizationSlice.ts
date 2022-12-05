import { createSlice } from '@reduxjs/toolkit';
import { getLocalStorage } from '../utils/utils';

const lang = getLocalStorage('lang');

const initialState: { lang: string } = {
  lang: lang || 'en',
};

const localizationSlice = createSlice({
  name: 'lacalization',
  initialState,
  reducers: {
    setLang: (state, action) => {
      localStorage.setItem('lang', action.payload);
      state.lang = action.payload;
    },
  },
});

export const { setLang } = localizationSlice.actions;
export default localizationSlice.reducer;
