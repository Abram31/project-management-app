import React, { useState, useEffect, FormEventHandler } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DragDropContext, DraggableProps, Droppable, DropResult } from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { fetchRequest } from 'fetch/fetchRequest';
import { ROUTES, URLS } from 'constants/constants';
import { useAppDispatch, useAuthUser } from 'hooks/hooks';
import Preloader from 'components/modules/common/preloader/Preloader';

import Column from '../column/Column';
import FormBtn from 'components/modules/authentication/formBtn/FormBtn';
import BoardModal from '../board-modal/BoardModal';
import InputField from 'components/modules/common/inputField/InputField';

import classes from './singleBoard.module.scss';
import { useTranslation } from 'react-i18next';

export interface IData {
  boardTitle: string;
  boardDescription: string;
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

  if (request) {
    const myData: IData = {
      boardTitle: request.title,
      boardDescription: request.description,
      columns: request.columns.sort((a: ColumnType, b: ColumnType) => a.order - b.order),
    };

    updateData(myData!);
    return request;
  }
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
  const [data, updateData] = useState<IData | null>(null);
  const [isAddColumnModal, setAddColumnModal] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { boardId } = useParams();
  const { user } = useAuthUser();
  const { register, getValues, reset } = useForm();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    getData(boardId, updateData);
  }, [boardId]);

  const handleAddColumn: FormEventHandler<HTMLFormElement> = (e) => {
    setLoading(true);
    e.preventDefault();
    const { column_title } = getValues();
    if (!column_title) {
      toast.error('Please fill in column title.');
      setLoading(false);
      return;
    }
    setAddColumnModal(false);
    const request = fetchRequest({
      URL: `${URLS.boards}/${boardId}/columns`,
      method: 'POST',
      token: localStorage.getItem('token')!,
      bodyParams: {
        title: column_title,
      },
    });
    request
      .then(({ id, order, title }: { id: string; order: string; title: string }) => {
        getData(boardId, updateData);
      })
      .then(() => setLoading(false));
    toast.success(t('ColumnCreated'));
    reset();
  };

  const handleDragEnd = async (result: DropResult) => {
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
        ...data,
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
        ...data,
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
      boardTitle: data!.boardTitle,
      boardDescription: data!.boardDescription,
      columns,
    };

    updateData(newData);
  };

  return (
    <>
      <div className={classes.container}>
        <div className={classes.container__header}>
          <Link to={ROUTES.boards}>{t('Back')}</Link>
          <h2 className={classes.title}>{data && data.boardTitle}</h2>
        </div>
        <div className={classes.columns__container}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal" type="column">
              {(provided) => (
                <div
                  className={classes.columns}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
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
                  <div className={classes.button}>
                    <FormBtn onClick={() => setAddColumnModal(true)}>{t('AddColumn')}</FormBtn>
                  </div>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
      <BoardModal
        title={t('AddColumn')}
        isActive={isAddColumnModal}
        setActive={setAddColumnModal}
        handleSubmit={handleAddColumn}
      >
        <label className={classes.label} htmlFor="column_title">
          {t('ColumnTitle')}
        </label>
        <InputField {...register('column_title')} id="column_title" placeholder={t('TypeTitle')} />
      </BoardModal>
      {isLoading && <Preloader />}
    </>
  );
};

export default SingleBoard;
