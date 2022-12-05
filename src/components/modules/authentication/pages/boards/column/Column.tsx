import React, { useState, FormEventHandler } from 'react';
import { Droppable, Draggable, DraggableProps } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { IData } from '../single-board/SingleBoard';
import { fetchRequest } from 'fetch/fetchRequest';
import { ColumnType, TaskType } from '../single-board/SingleBoard';
import { URLS } from 'constants/constants';
import { useAuthUser } from 'hooks/hooks';
import { getData } from '../single-board/SingleBoard';
import Preloader from 'components/modules/common/preloader/Preloader';

import Task from '../task/Task';
import FormBtn from 'components/modules/authentication/formBtn/FormBtn';
import BoardModal from '../board-modal/BoardModal';
import InputField from 'components/modules/common/inputField/InputField';
import { ButtonDeleteBasket } from 'components/modules/common/ButtonDeleteBasket/ButtonDeleteBasket';

import classes from './column.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
  column: ColumnType;
  tasks: TaskType[];
  index: DraggableProps['index'];
  boardId?: string;
  updateData: React.Dispatch<React.SetStateAction<IData | null>>;
};

const Column = ({ column, tasks, index, boardId, updateData }: Props) => {
  const [columnTitle, setColumnTitle] = useState<string>(column.title);
  const [isColumnTitleChange, setColumnTitleChange] = useState<boolean>(false);
  const [isAddTaskActive, setAddTaskModal] = useState<boolean>(false);
  const [isUpdateTask, setUpdateTask] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<TaskType | null>(null);
  const [isTaskModal, setTaskModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isConfirmationColumnDelete, setConfirmationColumnDelete] = useState<boolean>(false);
  const [isConfirmationTaskDelete, setConfirmationTaskDelete] = useState<boolean>(false);
  const { register, getValues, reset } = useForm();
  const { user } = useAuthUser();
  const { t } = useTranslation();

  const handleChangeColumnTitle = () => {
    const { column_title } = getValues();
    setColumnTitle(column_title);
    setColumnTitleChange(false);
  };

  const handleDeleteColumn: FormEventHandler<HTMLFormElement> = (e) => {
    setLoading(true);
    e.preventDefault();
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns/${column.id}`,
      method: 'DELETE',
      token: localStorage.getItem('token')!,
    });
    request.then(() => getData(boardId, updateData));
    toast.success(t('ColumnDeleted'));
  };

  const handleAddTask: FormEventHandler<HTMLFormElement> = (e) => {
    setLoading(true);
    setAddTaskModal(false);
    e.preventDefault();
    const { task_title_create, task_description_create } = getValues();
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns/${column.id}/tasks`,
      method: 'POST',
      token: localStorage.getItem('token')!,
      bodyParams: {
        title: task_title_create,
        description: task_description_create,
        userId: user.userId,
      },
    });
    request
      .then(() => getData(boardId, updateData))
      .then(() => {
        reset();
        setLoading(false);
      });
    toast.success(t('TaskCreated'));
  };

  const getTask = (e: React.SyntheticEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    const idx = target.dataset.id && target.dataset.id;
    const [targetData] = column.tasks.filter(({ id }) => idx === id);

    return targetData;
  };

  const handleClickEditTask = (e: React.SyntheticEvent<HTMLDivElement>) => {
    setCurrentTask(getTask(e));
    setUpdateTask(true);
  };

  const handleClickDeleteTask = (e: React.SyntheticEvent<HTMLDivElement>) => {
    setCurrentTask(getTask(e));
    setConfirmationTaskDelete(true);
  };

  const handleClickDeleteColumn = () => {
    setConfirmationColumnDelete(true);
  };

  const handleDeleteTask: FormEventHandler<HTMLFormElement> = (e) => {
    setLoading(true);
    setConfirmationTaskDelete(false);
    e.preventDefault();
    const id = currentTask!.id;
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns/${column.id}/tasks/${id}`,
      method: 'DELETE',
      token: localStorage.getItem('token')!,
    });
    request.then(() => getData(boardId, updateData)).then(() => setLoading(false));
    toast.success(t('TaskDeleted'));
  };

  const showTaskDetails = (e: React.SyntheticEvent<HTMLDivElement>) => {
    setCurrentTask(getTask(e));
    setTaskModal(true);
  };

  const handleEditTask: FormEventHandler<HTMLFormElement> = (e) => {
    setLoading(true);
    setUpdateTask(false);
    e.preventDefault();
    const { task_title_edit, task_description_edit } = getValues();
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns/${column.id}/tasks/${currentTask!.id}`,
      method: 'PUT',
      token: localStorage.getItem('token')!,
      bodyParams: {
        title: task_title_edit,
        order: currentTask!.order,
        description: task_description_edit,
        userId: user.userId,
        boardId,
        columnId: column.id,
      },
    });
    request
      .then(() => getData(boardId, updateData))
      .then(() => {
        reset({ task_title_edit: '', task_description_edit: '' });
        setLoading(false);
      });
    toast.success(t('TaskEdited'));
  };

  return (
    <>
      <Draggable draggableId={column.id} index={index}>
        {(provided) => (
          <div
            className={classes.column}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            {isColumnTitleChange ? (
              <div className={classes.title__change_container}>
                <div className={classes.title__input}>
                  <InputField
                    {...register('column_title', { value: columnTitle })}
                    id="column_title"
                    autoFocus={true}
                  />
                </div>
                <div className={classes.title__buttons}>
                  <div className={classes.title__button_box}>
                    <button
                      className={classes.cancel__button}
                      onClick={() => setColumnTitleChange(false)}
                    >
                      {t('Cancel')}
                    </button>
                  </div>
                  <div className={classes.title__button_box}>
                    <FormBtn onClick={handleChangeColumnTitle}>{t('Submit')}</FormBtn>
                  </div>
                </div>
              </div>
            ) : (
              <div className={classes.title__container}>
                <h2 className={classes.title} onClick={() => setColumnTitleChange(true)}>
                  {columnTitle}
                </h2>
                <div className={classes.button__box}>
                  <ButtonDeleteBasket onClick={handleClickDeleteColumn} id={column.id} />
                </div>
              </div>
            )}
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  className={snapshot.isDraggingOver ? classes.list__active : classes.list}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {tasks.map((task, idx) => (
                    <Task
                      key={task.id}
                      task={task}
                      showDetails={showTaskDetails}
                      handleClickEdit={handleClickEditTask}
                      handleClickDeleteButton={handleClickDeleteTask}
                      index={idx}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            <div className={classes.button}>
              <FormBtn onClick={() => setAddTaskModal(true)}>{t('AddTask')}</FormBtn>
            </div>
          </div>
        )}
      </Draggable>
      {isLoading && <Preloader />}
      <BoardModal
        title={t('AddTask')}
        isActive={isAddTaskActive}
        setActive={setAddTaskModal}
        handleSubmit={handleAddTask}
      >
        <div className={classes.input_box}>
          <label className={classes.label} htmlFor="task_title_create">
            {t('TaskTitle')}
          </label>
          <InputField
            {...register('task_title_create')}
            id="task_title_create"
            placeholder={t('TypeTitle')}
          />
        </div>
        <div className={classes.input_box}>
          <label className={classes.label} htmlFor="task_description_create">
            {t('TaskDescription')}
          </label>
          <InputField
            {...register('task_description_create')}
            id="task_description_create"
            placeholder={t('TypeDescription')}
          />
        </div>
      </BoardModal>
      <BoardModal
        title={t('UpdateTask')}
        isActive={isUpdateTask}
        setActive={setUpdateTask}
        handleSubmit={handleEditTask}
      >
        <div className={classes.input_box}>
          <label className={classes.label} htmlFor="task_title_edit">
            {t('TaskTitle')}
          </label>
          <InputField
            {...register('task_title_edit')}
            id="task_title_edit"
            placeholder={t('TypeTitle')}
          />
        </div>
        <div className={classes.input_box}>
          <label className={classes.label} htmlFor="task_description_edit">
            {t('TaskDescription')}
          </label>
          <InputField
            {...register('task_description_edit')}
            id="task_description_edit"
            placeholder={t('TypeDescription')}
          />
        </div>
      </BoardModal>
      <BoardModal
        title={currentTask ? currentTask.title : t('TaskDetails')}
        isActive={isTaskModal}
        setActive={setTaskModal}
        isDetails={true}
      >
        <p>
          {t('Description')} : {currentTask && currentTask.description}
        </p>
      </BoardModal>
      <BoardModal
        title={t('DeleteColumnQuestion')}
        isActive={isConfirmationColumnDelete}
        setActive={setConfirmationColumnDelete}
        handleSubmit={handleDeleteColumn}
      />
      <BoardModal
        title={t('DeleteTaskQuestion')}
        isActive={isConfirmationTaskDelete}
        setActive={setConfirmationTaskDelete}
        handleSubmit={handleDeleteTask}
      />
    </>
  );
};
export default Column;
