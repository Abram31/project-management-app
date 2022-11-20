import React, { memo } from 'react';
import styles from './InputField.module.scss';
import Error from '../error/Error';

interface IInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField = React.forwardRef<HTMLInputElement, IInputFieldProps>((props, ref) => {
  const { error = '', handleChange, ...inputProps } = props;

  return (
    <div className={styles.input__box}>
      <input
        ref={ref}
        onChange={handleChange}
        className={`${styles.input} ${error ? styles.invalid : ''}`}
        {...inputProps}
      />
      <Error>{error}</Error>
    </div>
  );
});

export default memo(InputField);
