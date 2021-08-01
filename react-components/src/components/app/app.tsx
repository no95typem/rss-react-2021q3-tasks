import * as React from 'react';

import { jsx } from '@emotion/core';
import { Button, VisuallyHidden } from 'sancho';
// import { Button } from '@blueprintjs/core';
import { FormAddItem } from '../form/form-add-item';
import { ContentBox } from '../content-box/content-box';
import { Genres, DataRecordData } from '../record/record';
import { OBJ_PROCESSOR } from '../../lib/processors/obj-processor';

import styles from './app.scss';
import { PRESETS } from './presets';
import { ImgLoader, ImgLoaderProps } from '../img-loader/img-loader';
import { ImgUploader } from '../img-loader/extenders/img-uploader/img-uploader';

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

  private lastGivedOrder = 0;

  private root = React.createRef<HTMLDivElement>();

  loadPresets(): void {
    const presets = PRESETS.slice();
    presets.forEach(p => {
      if (p.imgBase64 && p.imgBase64 !== '')
        ImgUploader.getBase64FromUrl(p.imgBase64).then(base64 => {
          p.imgBase64 = base64;
          this.handleNewDataRec(p);
        });
      else this.handleNewDataRec(p);
    });
  }

  componentDidMount(): void {
    this.loadPresets();
  }

  public render = (): JSX.Element => {
    return (
      <div className={styles.app} ref={this.root}>
        <FormAddItem onSubmit={this.handleNewDataRec}></FormAddItem>
        <ContentBox
          memory={this.state.memory}
          onChange={this.handleDataRecUpdate}
        />
      </div>
    );
  };

  private handleNewDataRec = (rec: DataRecordData) => {
    if (this.state.memory[rec.id]) return false;
    this.setState(state => {
      const { memory } = state as AppState;
      memory[rec.id] = OBJ_PROCESSOR.deepClone(rec);
      memory[rec.id].pinned = !!memory[rec.id].pinned;
      if (rec.pinned) memory[rec.id].pinnedOrder = --this.lastGivedOrder;
      else memory[rec.id].pinnedOrder = 0;
      return { memory };
    });
    return true;
  };

  private handleDataRecUpdate = (
    rec: DataRecordData,
    e: React.ChangeEvent,
    key: keyof DataRecordData,
  ) => {
    if (key === 'pinnedOrder') return;
    this.setState(state => {
      const { memory } = state as AppState;
      const record = memory[rec.id];
      if (record) {
        const input = e.target as HTMLInputElement;
        if (key === 'owned') record[key] = input.checked;
        else if (key === 'pinned') {
          record[key] = input.checked;
          if (input.checked) record.pinnedOrder = --this.lastGivedOrder;
          else record.pinnedOrder = 0;
        } else if (key === 'rating') record[key] = +input.value;
        else if (key === 'releaseDate') record[key] = new Date(input.value);
        else record[key] = input.value as Genres;
        return { memory };
      }
      return {};
    });
  };
}
