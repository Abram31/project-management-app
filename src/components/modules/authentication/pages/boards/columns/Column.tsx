import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';

import { data, IData } from '../data';

import classes from '../boards.module.scss';

const Column = ({ title }: { title: string }) => {
  const [tasks, updateTasks] = useState<IData[]>(data);

  const handleDragEnd = (result: DropResult) => {
    const array = Array.from(tasks);
    const [removedItem] = array.splice(result.source.index, 1);
    array.splice(result.destination!.index, 0, removedItem);
    updateTasks(array);
  };

  return (
    <div className={classes.container}>
      <h3 className={classes.title}>{title}</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => (
            <ul className={classes.list} {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map(({ id, name }, idx) => {
                return (
                  <Draggable key={id} draggableId={id} index={idx}>
                    {(provided: DraggableProvided) => (
                      <li
                        className={classes.list__item}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {name}
                      </li>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Column;
