import * as React from 'react';
import { Button, Divider, Layer, Text, Toolbar } from 'sancho';
import { Validable } from '../../defs';
import { genUniqId } from '../../lib/generators/generators';
import { DataRecord, DataRecordData, Genres } from '../record/record';

import styles from './form-add-item.scss';

export type FormAddItemState = {
  data: DataRecordData;
};

export class FormAddItem extends React.Component<{
  onSubmit: (rec: DataRecordData) => boolean;
}> {
  static readonly TEXT_CONTENT_ENG = {
    btnSbt: 'Create new card',
  };

  state: FormAddItemState = {
    data: FormAddItem.genDefaultData(),
  };

  private TEXT_CONTENT = FormAddItem.TEXT_CONTENT_ENG;

  private dataRecord = React.createRef<Validable>();

  static genDefaultData() {
    return {
      title: '',
      artist: '',
      id: genUniqId(),
      owned: false,
    };
  }

  render(): JSX.Element {
    return (
      <Layer className={styles.root}>
        <form className={styles.root__form}>
          <Text gutter={false} variant="uppercase">
            Create new card
          </Text>

          <DataRecord
            data={this.state.data}
            params={{ full: false, onChange: this.handleRecordDataChange }}
            ref={this.dataRecord}
          />
          <Button
            type="submit"
            intent="primary"
            size="sm"
            onPress={this.handleSubmit}
            onClick={e => e.preventDefault()}
          >
            {this.TEXT_CONTENT.btnSbt}
          </Button>
        </form>
      </Layer>
    );
  }

  private handleSubmit: React.MouseEventHandler<HTMLButtonElement> = (
    e: React.MouseEvent,
  ) => {
    e.preventDefault();
    const valid = this.dataRecord.current?.validate(true);
    if (!valid) return;
    const { data } = this.state;
    while (!this.props.onSubmit(data)) {
      data.id = genUniqId();
    }
    this.setState(() => {
      return { data: FormAddItem.genDefaultData() };
    });
  };

  handleRecordDataChange = (
    e: React.ChangeEvent,
    key: keyof DataRecordData,
  ): void => {
    if (key === 'pinnedOrder') return;
    this.setState(() => {
      const { data } = this.state;
      const input = e.target as HTMLInputElement;
      if (key === 'owned' || key === 'pinned') data[key] = input.checked;
      else if (key === 'rating') data[key] = +input.value;
      else if (key === 'releaseDate')
        data[key] = input.value as unknown as Date;
      else data[key] = input.value as Genres;
      if (key === 'imgBase64') console.log(e);
      return { data };
    });
  };
}
