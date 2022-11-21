import React, { RefObject } from 'react';
import styles from './FormBtn.module.scss';

interface IFormBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  btnRef?: RefObject<HTMLButtonElement>;
  children: React.ReactNode;
  loading?: boolean;
}

function FormBtn(props: IFormBtnProps) {
  const { btnRef, children, loading, ...btnProps } = props;
  return (
    <button
      className={`${styles.button} ${loading ? styles.loader : ''}`}
      ref={btnRef}
      {...btnProps}
    >
      {children}
    </button>
  );
}

export default FormBtn;
