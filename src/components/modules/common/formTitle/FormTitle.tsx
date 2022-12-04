import React from 'react';
import styles from './FormTitle.module.scss';

function FormTitle(props: { children: React.ReactNode }) {
  return <h2 className={styles.title}>{props.children}</h2>;
}

export default FormTitle;
