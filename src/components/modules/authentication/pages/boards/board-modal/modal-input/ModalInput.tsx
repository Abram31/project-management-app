import React, { InputHTMLAttributes, ChangeEvent } from 'react';

import classes from './modalInput.module.scss';

type Props = {
  titleValue: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & InputHTMLAttributes<HTMLInputElement>;

const ModalInput = ({ handleChange, titleValue, ...props }: Props) => {
  return (
    <div className={classes.input__box}>
      <input
        className={classes.input}
        {...props}
        type="text"
        onChange={(e) => handleChange(e)}
        value={titleValue}
      />
    </div>
  );
};

export default ModalInput;
