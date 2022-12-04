import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { TaskType } from '../single-board/SingleBoard';
import { ButtonDeleteBasket } from 'components/modules/common/ButtonDeleteBasket/ButtonDeleteBasket';
import { EditButton } from 'components/modules/common/EditButton/EditButton';
import { MoreInfoButton } from 'components/modules/common/MoreInfoButton/MoreInfoButton';

import classes from './task.module.scss';

type Props = {
  task: TaskType;
  index: number;
  handleClickDeleteButton: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  handleClickEdit: (e: React.SyntheticEvent<HTMLDivElement>) => void;
  showDetails: (e: React.SyntheticEvent<HTMLDivElement>) => void;
};

const Task = ({ task, index, showDetails, handleClickEdit, handleClickDeleteButton }: Props) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {(provided) => (
        <div
          className={classes.task}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div className={classes.titles}>
            <p className={classes.title}>{task.title}</p>
          </div>
          <div className={classes.buttons}>
            <div className={classes.button__box}>
              <MoreInfoButton onClick={showDetails} id={task.id} />
            </div>
            <div className={classes.button__box}>
              <EditButton onClick={handleClickEdit} id={task.id} />
            </div>
            <div className={classes.button__box}>
              <ButtonDeleteBasket onClick={handleClickDeleteButton} id={task.id} />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default Task;
