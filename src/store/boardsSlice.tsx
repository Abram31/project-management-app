import { createSlice, Draft, PayloadAction } from '@reduxjs/toolkit';
import { StateBoardProps } from 'components/modules/Main/PageWithBoards/PageWIthBoards';
import { URLS } from 'constants/constants';
import { fetchRequest } from 'fetch/fetchRequest';
import { title } from 'process';

export interface BorderData {
  title: string;
  description: string;
  id: string;
}
export interface StateData {
  [key: string]: BorderData;
}
let initialState: StateData = {};
const wrapperFetch = async () => {
  initialState = await fetchRequest({
    method: 'GET',
    token: localStorage.getItem('token')!,
    URL: URLS.boards,
  });
};
wrapperFetch();

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    setBoards: (state, action: PayloadAction<StateBoardProps>) => {
      Object.entries(action.payload).map((item) => {
        state[`${item[1].id}`] = {
          title: item[1].title,
          description: item[1].description,
          id: item[1].id,
        };
      });
    },
    setBoard: (state, action: PayloadAction<BorderData>) => {
      state[`${action.payload.id}`] = {
        title: action.payload.title,
        description: action.payload.description,
        id: action.payload.id,
      };
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      console.log(action.payload);

      delete state[action.payload];
    },
  },
});

export const { setBoards, setBoard, removeBoard } = boardSlice.actions;
export default boardSlice;
