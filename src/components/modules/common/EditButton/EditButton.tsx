import React, { MouseEventHandler } from 'react';
import module from './editButton.module.scss';

type EditButtonProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  id: string;
};
export const EditButton = ({ onClick, id }: EditButtonProps) => {
  return <div onClick={onClick} className={module.edit} data-id={id}></div>;
};
