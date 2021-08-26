/* eslint-disable max-len */
import * as React from 'react';

import styles from './error-plug.scss';

export interface ErrorPlugProps {
  color?: string;
  size?: string;
  text?: string;
}

export const ErrorPlug: React.FC<ErrorPlugProps> = (props: ErrorPlugProps) => {
  return (
    <div className={styles.root} role="status">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={props.color || 'red'}
        viewBox="0 0 16 16"
        width={props.size || '50%'}
        height={props.size || '50%'}
      >
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z" />
      </svg>
      <span>{props.text}</span>
    </div>
  );
};
