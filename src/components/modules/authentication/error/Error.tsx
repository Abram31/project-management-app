import React, { memo } from 'react';
import styles from './Error.module.scss';

function Error(props: { children: React.ReactNode }) {
  return <>{props.children && <p className={styles.error}>{props.children}</p>}</>;
}

export default memo(Error);
