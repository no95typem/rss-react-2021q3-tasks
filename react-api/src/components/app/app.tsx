import * as React from 'react';

import { DataRecordData } from '../record/record';

import styles from './app.scss';
import Gallery from '../gallery/gallery';

type AppState = {
  memory: Record<string, DataRecordData>;
  hiddenChilds: Set<React.ReactElement>;
};

export default class App extends React.Component<Record<string, unknown>> {
  static presetsData: DataRecordData[] | undefined;

  // СПИСОК ОТЛОЖЕННОГО КОНТЕНТА
  state: AppState = {
    memory: {},
    hiddenChilds: new Set(),
  };

  private root = React.createRef<HTMLDivElement>();

  static download(
    content: string,
    fileName: string,
    contentType: string,
  ): void {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  public render = (): JSX.Element => {
    return (
      <div className={styles.app} ref={this.root}>
        <Gallery memory={this.state.memory} />
      </div>
    );
  };
}
