import React from 'react';
import module from './AboutTeam.module.scss';
import { members } from './members';

export const AboutTeam = () => {
  return (
    <div className={module.wrapper_about_team}>
      <h3 className={module.title}>Our Team</h3>
      <div className={module.container}>
        {Object.entries(members).map((item, index) => {
          return (
            <div key={`${item[0] + index}`} className={module.member}>
              <img className={module.photo} src={item[1].avatar} alt="" />
              <span className={module.name}>{item[1].name}</span>
              <p className={module.member_description}>{item[1].description}</p>
              <div className={module.wrapper_social_links}>
                <a className={module.link_github} href={item[1].gitHub}></a>
                <a className={module.link_linkedin} href={item[1].linkedIn}></a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
