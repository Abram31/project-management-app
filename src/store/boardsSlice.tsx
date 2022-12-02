import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ColumnType,
  IData,
} from 'components/modules/authentication/pages/boards/single-board/SingleBoard';
import { StateBoardProps } from 'components/modules/Main/PageWithBoards/PageWIthBoards';

export interface BorderData {
  title: string;
  description: string;
  id: string;
  columns: ColumnType[] | Columns;
}
export interface Columns {
  [columnId: string]: {
    title: string;
    order: string;
    columnId: string;
    boardId?: string;
    tasks?: null;
  };
}

export interface StateData {
  [key: string]: BorderData;
}
const initialState: StateData = {};

interface SetColumnsAction {
  boardId: string;
  title: string;
  order: string;
  columnId: string;
}

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
          columns: {},
        };
      });
    },
    setBoard: (state, action: PayloadAction<BorderData>) => {
      state[`${action.payload.id}`] = {
        title: action.payload.title,
        description: action.payload.description,
        id: action.payload.id,
        columns: {},
      };
    },
    removeBoard: (state, action: PayloadAction<string>) => {
      delete state[action.payload];
    },

    setColumns: (state, action: PayloadAction<IData>) => {
      state[action.payload.idBoard!] = { ...state[action.payload.idBoard!], columns: {} };

      state[action.payload.idBoard!].columns = action.payload.columns;
    },
    setColumn: (state, action: PayloadAction<SetColumnsAction>) => {
      state[action.payload.boardId] = {
        ...state[action.payload.boardId],
        columns: {
          ...state[action.payload.boardId].columns,
          [String(Object.entries(state[action.payload.boardId].columns).length)]: {
            boardId: action.payload.boardId,
            columnId: action.payload.columnId,
            order: action.payload.order,
            title: action.payload.title,
          },
        },
      };
    },
  },
});

export const { setBoards, setBoard, removeBoard, setColumns, setColumn } = boardSlice.actions;
export default boardSlice;
