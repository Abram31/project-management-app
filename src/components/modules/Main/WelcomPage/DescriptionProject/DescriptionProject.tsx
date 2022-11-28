import React from 'react';
import module from './DescriptionProject.module.scss';

export const DescriptionProject = () => {
  return (
    <div className={module.description_project}>
      <div className={module.img}></div>
      <div className={module.description}>
        <h3 className={module.description_title}>Project Management System</h3>
        <p className={module.description_text}>
          You can create and customize multiple views by filtering, sorting, and grouping. Adding
          custom fields to track metadata specific to your work. The project provides flexible
          features you can customize to your team’s needs and processes.
        </p>
      </div>
    </div>
  );
};
