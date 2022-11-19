import React, { useState } from 'react';
import module from './ChangeLang.module.scss';

export const ChangeLang = () => {
  const [lang, setLang] = useState(true);
  return (
    <span className={module.change_lang} onClick={() => setLang(!lang)}>
      {lang ? 'EN' : 'RU'}
    </span>
  );
};
