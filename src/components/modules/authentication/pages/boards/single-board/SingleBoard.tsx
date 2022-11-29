import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { initialData, IData } from './data';
import { fetchRequest } from 'fetch/fetchRequest';
import { URLS } from 'constants/constants';

import Column from '../columns/Column';

import classes from '../boards.module.scss';
import { useAuthUser } from 'hooks/hooks';

interface IFetch {
  id: string;
  title: string;
  description: string;
  columns: MyColumnType[];
}

export interface IMyData {
  // tasks?: MyTaskType[];
  columns: MyColumnType[];
  columnOrder?: number[];
}

export type MyColumnType = { id: string; title: string; order: number; tasks: MyTaskType[] };
export type MyTaskType = {
  id: string;
  title: string;
  order: number;
  description: string;
  userId: string;
  files?: [];
};

const SingleBoard = () => {
  const { id } = useParams();
  const [myDataState, updateMyDataState] = useState<IData>(initialData);

  const [data, updateData] = useState<IMyData>();

  const { user } = useAuthUser();

  useEffect(() => {
    const some = fetchRequest({
      URL: URLS.boards + '/' + id,
      method: 'GET',
      token: localStorage.getItem('token')!,
    });
    some.then((data) => {
      const myData: IMyData = {
        columns: data.columns,
        // tasks: data.columns.map((column: MyColumnType) => column.tasks),
        // columnOrder: data.columns.map((column: MyColumnType) => `column-${column.order}`),
        columnOrder: data.columns.map((column: MyColumnType, idx: number) => idx + 1),
      };

      data.columns.map((column: MyColumnType, idx: number) => (column.order = idx + 1));

      updateData(myData);
    });
  }, [id]);

  useEffect(() => {
    console.log('worked');
    if (data) data.columnOrder = data.columns.map(({ order }) => order);
  }, [data]);

  // useEffect(() => {
  //   const some = fetchRequest({
  //     URL: URLS.boards + '/' + id + '/columns/bf44db0a-b180-4e77-bf1a-4854ffd3a06c/tasks',
  //     method: 'POST',
  //     token: localStorage.getItem('token')!,
  // bodyParams: {
  //   title: 'Charge my phone',
  //   description: 'Domestic cat needs to be stroked gently',
  //   userId: user.userId,
  // },
  //   });
  //   some.then((data) => updateMyDataState(data));
  // }, [id]);

  // useEffect(() => {
  //   const some = fetchRequest({
  //     URL: URLS.boards + '/' + id + '/columns',
  //     method: 'POST',
  //     token: localStorage.getItem('token')!,
  //     bodyParams: {
  //       title: 'IDone',
  //       // description: 'Domestic cat needs to be stroked gently',
  //       // userId: user.userId,
  //     },
  //   });
  //   some.then((data) => updateMyDataState(data));
  // }, [id]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'column') {
      const columnOrder = [...(data!.columnOrder as number[])];
      const [removed] = columnOrder.splice(source.index, 1);
      columnOrder.splice(destination.index, 0, removed);

      // Tries
      // data!.columns.map((column: MyColumnType, idx: number) => (column.order = idx + 1));

      // const newColumns = data!.columns.map(({ ...args }, idx, arr) => {
      //   return { ...args, order: idx + 1 };
      // });

      const newColumns = columnOrder.map((order, idx) => {
        return (data!.columns[order - 1].order = idx + 1);
      });

      console.log(newColumns);
      console.log(data!.columns);
      console.log('columnOrder', data!.columnOrder);

      // Tries

      const newData = {
        columns: data!.columns,
        columnOrder: newColumns,
      };

      updateData(newData as IMyData);
      return;
    }

    const [start] = data!.columns.filter((column) => column.id === source.droppableId);
    const [end] = data!.columns.filter((column) => column.id === destination.droppableId);

    if (start === end) {
      const newColumns = [...data!.columns];
      const newTasks = start.tasks;
      const columnId = newColumns.findIndex((column) => column.id === start.id);
      const [removedTask] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removedTask);

      start.tasks = newTasks;
      newColumns.splice(columnId, 1, start);

      const newData = {
        ...data,
        columns: newColumns,
      };

      updateData(newData);
      return;
    }

    const newColumns = [...data!.columns];
    const newStartTasks = start.tasks;
    const newEndTasks = end.tasks;
    const [removedTask] = newStartTasks.splice(source.index, 1);
    newEndTasks.splice(destination.index, 0, removedTask);

    const startColumnId = newColumns.findIndex((column) => column.id === start.id);
    const endColumnId = newColumns.findIndex((column) => column.id === end.id);

    start.tasks = newStartTasks;
    end.tasks = newEndTasks;
    newColumns.splice(startColumnId, 1, start);
    newColumns.splice(endColumnId, 1, end);

    const newData = {
      ...data,
      columns: newColumns,
    };

    updateData(newData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div className={classes.container} {...provided.droppableProps} ref={provided.innerRef}>
            {data &&
              data.columnOrder!.map((order, idx) => {
                const [column] = data.columns.filter((col) => col.order === order);
                const tasks = column.tasks;

                return <Column key={column.id} column={column} tasks={tasks} index={idx} />;
              })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SingleBoard;

// return (
//   <DragDropContext onDragEnd={handleDragEnd}>
//     <Droppable droppableId="all-columns" direction="horizontal" type="column">
//       {(provided) => (
//         <div className={classes.container} {...provided.droppableProps} ref={provided.innerRef}>
//           {data!.columns.map((columnId, idx) => {
//             const column = data!.columns;
//             const tasks = data!.tasks.map((taskId) => data.tasks[taskId]);

//             return <Column key={column.id} column={column} tasks={tasks} index={idx} />;
//           })}
//           {provided.placeholder}
//         </div>
//       )}
//     </Droppable>
//   </DragDropContext>
// );
// };

// onst handleDragEnd = (result: DropResult) => {
//   const { source, destination, type } = result;
//   if (!destination) {
//     return;
//   }
//   if (destination.droppableId === source.droppableId && destination.index === source.index) {
//     return;
//   }

//   if (type === 'column' && data) {
//     const columnOrder = [...(data.columnOrder as string[])];
//     const [removed] = columnOrder.splice(source.index, 1);
//     columnOrder.splice(destination.index, 0, removed);
//     const newData = {
//       ...data,
//       columnOrder: columnOrder,
//     };
//     updateData(newData);
//     return;
//   }

//   const start = data!.columns.fiter(column => column.id === source.droppableId);
//   const end = data!.columns[destination.droppableId];

//   if (start === end) {
//     const newTaskIds = [...start.taskIds];
//     const [removed] = newTaskIds.splice(source.index, 1);
//     newTaskIds.splice(destination.index, 0, removed);
//     const newColumn = {
//       ...end,
//       taskIds: newTaskIds,
//     };
//     const newData: IData = {
//       ...data,
//       columns: {
//         ...data.columns,
//         [newColumn.id]: newColumn,
//       },
//     };
//     updateData(newData);
//     return;
//   }
//   const startTaskIds = [...start.taskIds];
//   const endTaskIds = [...end.taskIds];
//   const [removed] = startTaskIds.splice(source.index, 1);
//   endTaskIds.splice(destination.index, 0, removed);
//   const newColumnStart = {
//     ...start,
//     taskIds: startTaskIds,
//   };
//   const newColumnEnd = {
//     ...end,
//     taskIds: endTaskIds,
//   };
//   const newData: IData = {
//     ...data,
//     columns: {
//       ...data.columns,
//       [newColumnStart.id]: newColumnStart,
//       [newColumnEnd.id]: newColumnEnd,
//     },
//   };
//   updateData(newData);
// };
