import React, { useState } from 'react';

import Column from '../columns/Column';

import classes from './singleBoard.module.scss';

interface IColumn {
  id: string;
  title: string;
  order: number;
}

const columnsData = [
  { id: 'nf-1', title: 'some1', order: 1 },
  { id: 'nf-2', title: 'some2', order: 2 },
  { id: 'nf-3', title: 'some3', order: 3 },
  { id: 'nf-4', title: 'some4', order: 4 },
  { id: 'nf-5', title: 'some5', order: 5 },
  { id: 'nf-6', title: 'some6', order: 6 },
  { id: 'nf-7', title: 'some7', order: 7 },
];

const SingleBoard = () => {
  const [columns, setColumns] = useState<IColumn[] | null>(columnsData);

  return (
    <div className={classes.container}>
      {columns &&
        columns.map(({ id, title }) => {
          return <Column key={id} title={title} />;
        })}
    </div>
  );
};

export default SingleBoard;
