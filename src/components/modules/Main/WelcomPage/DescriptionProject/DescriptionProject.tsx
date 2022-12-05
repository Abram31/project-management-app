import React from 'react';
import module from './DescriptionProject.module.scss';
import { useTranslation } from 'react-i18next';

export const DescriptionProject = () => {
  const { t } = useTranslation();
  return (
    <div className={module.description_project}>
      <div className={module.img}></div>
      <div className={module.description}>
        <h3 className={module.description_title}>{t('ProjectManagementSystem')}</h3>
        <p className={module.description_text}>{t('descriptionProject')}</p>
      </div>
    </div>
  );
};
