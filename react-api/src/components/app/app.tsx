import * as React from 'react';
import { FormAddItem } from '../form/form-add-item';
import { ContentBox } from '../content-box/content-box';
import { DataRecordData } from '../record/record';

import styles from './app.scss';

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

  static testWallheaven(): Promise<Record<string, DataRecordData>> {
    return new Promise<Record<string, DataRecordData>>(res => {
      const q = 'sky';
      const fetchStr = `http://localhost:3020/http://wallhaven.cc/api/v1/search?q=${q}`;
      fetch(fetchStr)
        .then(response => {
          console.log(response);
          if (response.ok) return response.json();
          throw new Error('x');
        })
        .then(json => {
          App.download(
            JSON.stringify(json),
            fetchStr.replace('/', 'Z'),
            'text/json',
          );
          const obj = json as Record<string, unknown>;
          const dataObj: Record<string, DataRecordData> = {};
          (obj.data as Record<string, unknown>[]).forEach(it => {
            const item = it as Record<string, string>;
            const data: DataRecordData = {
              id: item.id,
              imgBase64: item.thumbs.small as unknown as string,
            };
            dataObj[data.id] = data;
          });
          res(dataObj);
        });
    });
  }

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

  componentDidMount() {
    App.testWallheaven().then(dataObj => {
      this.setState({ memory: dataObj });
    });
  }

  public render = (): JSX.Element => {
    return (
      <div className={styles.app} ref={this.root}>
        <FormAddItem></FormAddItem>
        <ContentBox memory={this.state.memory} />
      </div>
    );
  };
}
