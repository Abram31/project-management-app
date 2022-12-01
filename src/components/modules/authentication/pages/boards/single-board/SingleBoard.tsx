import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, DraggableProps, Droppable, DropResult } from 'react-beautiful-dnd';

import { fetchRequest } from 'fetch/fetchRequest';
import { URLS } from 'constants/constants';

import Column from '../columns/Column';

import classes from '../boards.module.scss';
import { useAppDispatch, useAuthUser } from 'hooks/hooks';
import { Columns, setColumn, setColumns } from 'store/boardsSlice';

export interface IData {
  columns: ColumnType[];
  idBoard?: string;
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

export const getData = async (
  boardId: string | undefined,
  updateData: React.Dispatch<React.SetStateAction<IData | null>>
) => {
  const request = await fetchRequest({
    URL: `${URLS.boards}/${boardId}`,
    method: 'GET',
    token: localStorage.getItem('token')!,
  });
  const myData: IData = {
    columns: request.columns.sort((a: ColumnType, b: ColumnType) => a.order - b.order),
  };
  setColumns({ columns: { ...request.columns }, idBoard: boardId });

  updateData(myData);
  // }
  return request;
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

const SingleBoard = () => {
  const { boardId } = useParams();
  const { user } = useAuthUser();
  const [data, updateData] = useState<IData | null>(null);
  const [columnName, setColumnName] = useState<string>('');
  const dispatch = useAppDispatch();
  // setColumns({ columns: { ...result.columns }, idBoard: boardId });
  useEffect(() => {
    getData(boardId, updateData).then((data) =>
      dispatch(setColumns({ columns: { ...data.columns }, idBoard: boardId }))
    );
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
    request.then(({ id, order, title }: { id: string; order: string; title: string }) => {
      getData(boardId, updateData);
      dispatch(setColumn({ boardId: boardId!, columnId: id, title: title, order }));
    });
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
      columns,
    };

    updateData(newData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div className={classes.container} {...provided.droppableProps} ref={provided.innerRef}>
            <div>
              <input type="text" value={columnName} onChange={handleColumnNameChange} />
              <button onClick={handleAddColumn}>Add column</button>
            </div>
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
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SingleBoard;
