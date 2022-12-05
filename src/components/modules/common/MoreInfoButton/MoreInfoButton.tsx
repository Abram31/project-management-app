import React, { MouseEventHandler } from 'react';
import module from './moreInfoButton.module.scss';

type MoreInfoButtonProps = {
  onClick?: MouseEventHandler<HTMLDivElement>;
  id: string;
};
export const MoreInfoButton = ({ onClick, id }: MoreInfoButtonProps) => {
  return <div onClick={onClick} className={module.info} data-id={id}></div>;
};
