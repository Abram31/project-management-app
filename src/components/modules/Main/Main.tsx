import React from 'react';
import module from './Main.module.scss';

interface MainProps {
  children: React.ReactNode;
}
export const Main = ({ children }: MainProps) => {
  return <main className={module.main}>{children}</main>;
};
