import * as React from 'react';

import styles from './app.scss';
import Gallery from '../gallery/gallery';
import { WHImageData } from '../../defs';

type AppState = {
  memory: Record<string, WHImageData>;
  hiddenChilds: Set<React.ReactElement>;
};

export default class App extends React.Component<Record<string, unknown>> {
  static presetsData: WHImageData[] | undefined;

  state: AppState = {
    memory: {},
    hiddenChilds: new Set(),
  };

  private root = React.createRef<HTMLDivElement>();

  public render = (): JSX.Element => {
    return (
      <div className={styles.app} ref={this.root}>
        <Gallery memory={this.state.memory} />
      </div>
    );
  };
}
