import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { ColumnType, TaskType } from '../single-board/data';

import Task from '../task/Task';

import classes from '../boards.module.scss';

type Props = { column: ColumnType; tasks: TaskType[]; index: number };

const Column = ({ column, tasks, index }: Props) => {
  return (
    <Draggable draggableId={column.id} index={index}>
      {(provided) => (
        <div
          className={classes.column}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h2 className={classes.title}>{column.title}</h2>
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                className={snapshot.isDraggingOver ? classes.list__active : classes.list}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {tasks.map((task, idx) => (
                  <Task key={task.id} task={task} index={idx} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};
export default Column;
