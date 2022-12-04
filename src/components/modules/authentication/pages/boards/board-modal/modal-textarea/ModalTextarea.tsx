import React, { TextareaHTMLAttributes } from 'react';

import classes from './modalTextarea.module.scss';

type Props = {
  descriptionValue: string;
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

const ModalTextarea = ({ descriptionValue, handleChange, ...props }: Props) => {
  return (
    <div className={classes.textarea__box}>
      <textarea
        className={classes.textarea}
        value={descriptionValue}
        onChange={(e) => handleChange(e)}
        {...props}
      />
    </div>
  );
};

export default ModalTextarea;
