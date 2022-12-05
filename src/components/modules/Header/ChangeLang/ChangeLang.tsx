import { useAppSelector } from 'hooks/hooks';
import React from 'react';
import module from './ChangeLang.module.scss';

interface ChangeLangProps {
  onHandleClick: (lng: string) => void;
}
export const ChangeLang = ({ onHandleClick }: ChangeLangProps) => {
  const { lang } = useAppSelector((state) => state.lang);
  const langs = ['en', 'ru'];

  const handleLangClick = () => {
    onHandleClick(lang === langs[0] ? langs[1] : langs[0]);
  };

  return (
    <span className={module.change_lang} onClick={handleLangClick}>
      {lang}
    </span>
  );
};
