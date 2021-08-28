import * as React from 'react';

import styles from './switcher.scss';

export class Switcher extends React.Component<{
  checked: boolean;
  onChange: () => unknown;
}> {
  render() {
    return (
      <label className={styles.root}>
        <input
          type="checkbox"
          onChange={this.props.onChange}
          checked={this.props.checked}
        />
      </label>
    );
  }
}
