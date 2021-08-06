import * as React from 'react';

import styles from './switcher.scss';

export interface SwitcherProps {
  checked?: boolean;
  onChange: (e: React.ChangeEvent) => unknown;
  checkedText?: string;
  uncheckedText?: string;
}

export const Switcher: React.FC<SwitcherProps> = (props: SwitcherProps) => {
  return (
    <label className={styles.root}>
      <input
        className={styles.root__input}
        type="checkbox"
        onChange={props.onChange}
        checked={props.checked}
        style={{ display: 'none' }}
      />
      <span
        className={`${styles['root__text-checked']} ${styles.root__text}`}
        style={{ opacity: props.checked ? '1' : '0' }}
      >
        {props.checkedText}
      </span>
      <span
        className={`${styles['root__text-unchecked']} ${styles.root__text}`}
        style={{ opacity: props.checked ? '0' : '1' }}
      >
        {props.uncheckedText}
      </span>
      <div className={styles.root__switch}>
        <div className={styles['root__switch-ball']}></div>
      </div>
    </label>
  );
};
