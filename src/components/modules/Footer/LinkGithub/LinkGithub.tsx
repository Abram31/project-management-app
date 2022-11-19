import React from 'react';
import module from './LinkGithub.module.scss';

interface LinkGithubProps {
  nameGitHub: string;
  linkGithub: string;
}
export const LinkGithub = ({ nameGitHub, linkGithub }: LinkGithubProps) => {
  return (
    <a className={module.link_github} href={linkGithub}>
      {nameGitHub}
    </a>
  );
};
