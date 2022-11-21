import React from 'react';
import styles from './Preloader.module.css';

interface preloaderProps {
  boxPosition?: typePosition;
}
type typePosition = 'absolute' | 'fixed';

function Preloader(props?: preloaderProps) {
  return (
    <div
      data-testid="preloader"
      className={`${styles.preloader__box} ${styles[props?.boxPosition || 'fixed']}`}
    >
      <div className={styles.preloader}></div>
    </div>
  );
}

export default React.memo(Preloader);
