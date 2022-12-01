import React, { useState } from 'react';
import { Droppable, Draggable, DraggableProps } from 'react-beautiful-dnd';

import { IData } from '../single-board/SingleBoard';
import { fetchRequest } from 'fetch/fetchRequest';
import { URLS } from 'constants/constants';
import { useAuthUser } from 'hooks/hooks';
import { getData } from '../single-board/SingleBoard';

import { ColumnType, TaskType } from '../single-board/SingleBoard';
import Task from '../task/Task';
import FormBtn from 'components/modules/authentication/formBtn/FormBtn';

import classes from './column.module.scss';

type Props = {
  column: ColumnType;
  tasks: TaskType[];
  index: DraggableProps['index'];
  boardId?: string;
  updateData: React.Dispatch<React.SetStateAction<IData | null>>;
};

const Column = ({ column, tasks, index, boardId, updateData }: Props) => {
  const [taskName, setTaskName] = useState<string>('');
  const { user } = useAuthUser();

  const handleAddTask = () => {
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns/${column.id}/tasks`,
      method: 'POST',
      token: localStorage.getItem('token')!,
      bodyParams: {
        title: taskName,
        description: taskName,
        userId: user.userId,
      },
    });
    request.then(() => getData(boardId, updateData));
    setTaskName('');
  };

  const handleTaskNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskName(e.target.value);
  };

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
          <div className={classes.button}>
            <FormBtn onClick={handleAddTask}>Add task</FormBtn>
          </div>
        </div>
      )}
    </Draggable>
  );
};
export default Column;
