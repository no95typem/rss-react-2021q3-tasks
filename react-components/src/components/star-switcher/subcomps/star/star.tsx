import * as React from 'react';

import styles from './star.scss';

export class Star extends React.Component<{
  active: boolean;
  onClick: () => void;
}> {
  render() {
    return (
      <label
        className={`${styles.root} ${
          this.props.active ? styles.root_active : styles['root_not-active']
        }`}
        onMouseUp={this.props.onClick}
      >
        <input className={styles.root_input} type="radio" />
      </label>
    );
  }
}
