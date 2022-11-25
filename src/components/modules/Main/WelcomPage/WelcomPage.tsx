import React from 'react';
import { AboutTeam } from './AboutTeam/AboutTeam';
import { DescriptionProject } from './DescriptionProject/DescriptionProject';
import module from './WelcomPage.module.scss';

export const WelcomPage = () => {
  return (
    <section className={module.welcom_page}>
      <DescriptionProject />
      <AboutTeam />
    </section>
  );
};
