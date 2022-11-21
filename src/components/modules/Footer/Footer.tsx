import React from 'react';
import { LinkGithub } from './LinkGithub/LinkGithub';
import module from './Footer.module.scss';
import { members } from '../WelcomPage/AboutTeam/members';

export const Footer = () => {
  return (
    <footer className={module.footer}>
      <div className={module.wrapper_links}>
        {Object.entries(members).map((item, index) => {
          return (
            <LinkGithub
              key={`${item[0]}-${index}`}
              nameGitHub={item[1].gitHubName}
              linkGithub={item[1].gitHub}
            />
          );
        })}
      </div>
      <span>2022</span>
      <a className={module.rsschool_link} href="https://rs.school/js/"></a>
    </footer>
  );
};
