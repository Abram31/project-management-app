import React, { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';

import { initialData, IData } from './data';

import Column from '../columns/Column';

import classes from '../boards.module.scss';

const SingleBoard = () => {
  const [data, updateData] = useState<IData>(initialData);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, type } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'column') {
      const columnOrder = [...data.columnOrder];
      const [removed] = columnOrder.splice(source.index, 1);
      columnOrder.splice(destination.index, 0, removed);

      const newData = {
        ...data,
        columnOrder: columnOrder,
      };

      updateData(newData);
      return;
    }

    const start = data.columns[source.droppableId];
    const end = data.columns[destination.droppableId];

    if (start === end) {
      const newTaskIds = [...start.taskIds];
      const [removed] = newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, removed);

      const newColumn = {
        ...end,
        taskIds: newTaskIds,
      };

      const newData: IData = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      updateData(newData);
      return;
    }

    const startTaskIds = [...start.taskIds];
    const endTaskIds = [...end.taskIds];

    const [removed] = startTaskIds.splice(source.index, 1);
    endTaskIds.splice(destination.index, 0, removed);

    const newColumnStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const newColumnEnd = {
      ...end,
      taskIds: endTaskIds,
    };

    const newData: IData = {
      ...data,
      columns: {
        ...data.columns,
        [newColumnStart.id]: newColumnStart,
        [newColumnEnd.id]: newColumnEnd,
      },
    };

    updateData(newData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div className={classes.container} {...provided.droppableProps} ref={provided.innerRef}>
            {data.columnOrder.map((columnId, idx) => {
              const column = data.columns[columnId];
              const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

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
