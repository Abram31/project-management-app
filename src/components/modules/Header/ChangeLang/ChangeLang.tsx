import React, { MouseEventHandler, useState } from 'react';
import module from './ChangeLang.module.scss';

interface ChangeLangProps {
  onHandleClick: MouseEventHandler<HTMLElement>;
}
export const ChangeLang = ({ onHandleClick }: ChangeLangProps) => {
  const [lang, setLang] = useState(true);
  return (
    <span
      className={module.change_lang}
      onClick={(event) => {
        setLang(!lang);
        onHandleClick(event);
      }}
    >
      {lang ? 'EN' : 'RU'}
    </span>
  );
};
