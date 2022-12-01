import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TaskType } from '../single-board/SingleBoard';

import classes from './task.module.scss';

const Task = ({ task, index }: { task: TaskType; index: number }) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={classes.task}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {task.title}
        </div>
      )}
    </Draggable>
  );
};

export default Task;
