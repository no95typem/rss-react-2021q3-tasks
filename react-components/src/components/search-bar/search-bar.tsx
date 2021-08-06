import * as React from 'react';

import styles from './search-bar.scss';

const magnifyingGlass = require('./search.png');

export interface SearchBarProps {
  text?: string;
  onChange: (e: React.ChangeEvent) => void;
  onSubmit?: () => void;
}

export class SearchBar extends React.Component<SearchBarProps> {
  render() {
    return (
      <div className={styles.root}>
        <img
          className={styles['root__magnifying-glass']}
          src={magnifyingGlass.default}
        ></img>
        <input
          className={styles.root__input}
          type="text"
          value={this.props.text || ''}
          onChange={this.props.onChange}
        ></input>
      </div>
    );
  }
}
