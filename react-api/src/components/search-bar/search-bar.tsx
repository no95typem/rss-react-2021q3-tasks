import * as React from 'react';
// import { Spin } from 'antd';

import styles from './search-bar.scss';

const magnifyingGlass = require('./search.png');

export interface SearchBarProps {
  text?: string;
  className?: string;
  onChange: (e: React.ChangeEvent) => void;
  onSubmit?: () => void;
  busy?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {
  return (
    <div
      className={`${styles.root} ${props.className || ''} ${
        props.busy ? styles.root_disabled : ''
      }`}
    >
      <img
        className={styles['root__magnifying-glass']}
        src={magnifyingGlass.default}
      ></img>
      <input
        className={styles.root__input}
        type="text"
        value={props.text || ''}
        onChange={props.onChange}
        onKeyDown={e => {
          if (e.key === 'Enter') props.onSubmit?.();
        }}
      ></input>
      {/* {props.busy ? <Spin size="small"></Spin> : undefined} */}
    </div>
  );
};
