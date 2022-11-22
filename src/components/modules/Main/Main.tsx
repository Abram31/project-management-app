import React from 'react';
import module from './Main.module.scss';
import { WelcomPage } from './WelcomPage/WelcomPage';

interface MainProps {
  children: React.ReactNode;
}
export const Main = ({ children }: MainProps) => {
  return <main className={module.main}>{children}</main>;
};
