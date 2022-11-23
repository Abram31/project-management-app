import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DroppableProvided,
} from 'react-beautiful-dnd';

import { data, IData } from './data';

import classes from './boards.module.scss';

const Boards = () => {
  const [list, updateList] = useState<IData[]>(data);

  const handleDragEnd = (result: DropResult) => {
    const array = Array.from(list);
    const [removedItem] = array.splice(result.source.index, 1);
    array.splice(result.destination!.index, 0, removedItem);
    updateList(array);
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Boards page</h1>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="list">
          {(provided: DroppableProvided) => (
            <ul className={classes.list} {...provided.droppableProps} ref={provided.innerRef}>
              {list.map(({ id, name }, idx) => {
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

export default Boards;
