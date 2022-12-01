import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, DraggableProps, Droppable, DropResult } from 'react-beautiful-dnd';

import { fetchRequest } from 'fetch/fetchRequest';
import { URLS } from 'constants/constants';
import { useAuthUser } from 'hooks/hooks';

import Column from '../column/Column';
import FormBtn from 'components/modules/authentication/formBtn/FormBtn';

import classes from './singleBoard.module.scss';

export interface IData {
  boardTitle: string;
  boardDescription: string;
  columns: ColumnType[];
}

export type ColumnType = { id: string; title: string; order: number; tasks: TaskType[] };
export type TaskType = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  files?: [];
};

export const getData = (
  boardId: string | undefined,
  updateData: React.Dispatch<React.SetStateAction<IData | null>>
) => {
  const request = fetchRequest({
    URL: `${URLS.boards}/${boardId}`,
    method: 'GET',
    token: localStorage.getItem('token')!,
  });
  request.then((result) => {
    const myData: IData = {
      boardTitle: result.title,
      boardDescription: result.description,
      columns: result.columns.sort((a: ColumnType, b: ColumnType) => a.order - b.order),
    };

    updateData(myData);
  });
};

const updateColumns = (
  boardId: string | undefined,
  columnId: string,
  title: string,
  order: DraggableProps['index']
) => {
  fetchRequest({
    URL: `${URLS.boards}/${boardId}/columns/${columnId}`,
    method: 'PUT',
    token: localStorage.getItem('token')!,
    bodyParams: {
      title,
      order,
    },
  });
};

const updateTasks = (
  boardId: string | undefined,
  columnSourceId: string,
  columnDestinationId: string,
  taskId: string,
  userId: string,
  title: string,
  description: string,
  order: DraggableProps['index']
) => {
  fetchRequest({
    URL: `${URLS.boards}/${boardId}/columns/${columnSourceId}/tasks/${taskId}`,
    method: 'PUT',
    token: localStorage.getItem('token')!,
    bodyParams: {
      title,
      order,
      description,
      userId,
      boardId,
      columnId: columnDestinationId,
    },
  });
};

// const getColumn = (boardId?: string) => {
//   const request = fetchRequest({
//     URL: `${URLS.boards}/${boardId}`,
//     method: 'GET',
//     token: localStorage.getItem('token')!,
//   });
//   request.then((result) => {
//     console.log(result);
//   });
// };

const SingleBoard = () => {
  const { boardId } = useParams();
  const { user } = useAuthUser();
  const [data, updateData] = useState<IData | null>(null);
  const [columnName, setColumnName] = useState<string>('');

  useEffect(() => {
    getData(boardId, updateData);
  }, [boardId]);

  const handleAddColumn = () => {
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns`,
      method: 'POST',
      token: localStorage.getItem('token')!,
      bodyParams: {
        title: columnName,
      },
    });
    request.then(() => getData(boardId, updateData));
    setColumnName('');
  };

  const handleColumnNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumnName(e.target.value);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'column' && data) {
      const columns = [...data.columns];

      const [column] = columns.splice(source.index, 1);
      columns.splice(destination.index, 0, column);
      columns.map((column, idx) => (column.order = idx + 1));
      columns.map(({ id, title }, idx) => updateColumns(boardId, id, title, idx + 1));

      const newData = {
        ...data,
        columns,
      };

      updateData(newData);
      return;
    }

    const [start] = data!.columns.filter((column) => column.id === source.droppableId);
    const [end] = data!.columns.filter((column) => column.id === destination.droppableId);

    if (start === end && data) {
      const columns = [...data.columns];
      const newTasks = start.tasks;
      const columnId = columns.findIndex((column) => column.id === start.id);
      const [draggableTask] = newTasks.filter((task) => task.id === draggableId);

      updateTasks(
        boardId,
        source.droppableId,
        destination.droppableId,
        draggableId,
        user.userId,
        draggableTask.title,
        draggableTask.description,
        destination.index + 1
      );

      newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, draggableTask);
      start.tasks = newTasks;
      columns.splice(columnId, 1, start);

      const newData = {
        ...data,
        columns,
      };

      updateData(newData);
      return;
    }

    const columns = [...data!.columns];
    const newStartTasks = start.tasks;
    const newEndTasks = end.tasks;
    const [draggableTask] = newStartTasks.filter((task) => task.id === draggableId);

    updateTasks(
      boardId,
      source.droppableId,
      destination.droppableId,
      draggableId,
      user.userId,
      draggableTask.title,
      draggableTask.description,
      destination.index + 1
    );

    newStartTasks.splice(source.index, 1);
    newEndTasks.splice(destination.index, 0, draggableTask);

    const startColumnId = columns.findIndex((column) => column.id === start.id);
    const endColumnId = columns.findIndex((column) => column.id === end.id);

    start.tasks = newStartTasks;
    end.tasks = newEndTasks;

    columns.splice(startColumnId, 1, start);
    columns.splice(endColumnId, 1, end);

    const newData = {
      boardTitle: data!.boardTitle,
      boardDescription: data!.boardDescription,
      columns,
    };

    updateData(newData);
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>{data && data.boardTitle}</h2>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <div
              className={classes.columns__container}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {data &&
                data.columns!.map((column, idx) => {
                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={column.tasks}
                      index={idx}
                      boardId={boardId}
                      updateData={updateData}
                    />
                  );
                })}
              {provided.placeholder}
              <div className={classes.column__button}>
                <FormBtn onClick={handleAddColumn}>Add column</FormBtn>
              </div>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default SingleBoard;
