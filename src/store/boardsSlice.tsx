import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StateBoardProps } from 'components/modules/Main/PageWithBoards/PageWIthBoards';

export interface BorderData {
  title: string;
  description: string;
  id: string;
}
export interface StateData {
  [key: string]: BorderData;
}
const initialState: StateData = {};

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
      delete state[action.payload];
    },
  },
});

export const { setBoards, setBoard, removeBoard } = boardSlice.actions;
export default boardSlice;
