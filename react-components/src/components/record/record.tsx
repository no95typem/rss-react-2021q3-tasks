/* eslint-disable react/display-name */
import * as React from 'react';
import { ImgUploader } from '../img-loader/extenders/img-uploader/img-uploader';
import { DataRecordTitle } from './title/title';
import { StarSwitcher } from '../star-switcher/star-switcher';
import { Validable } from '../../defs';
import { OBJ_PROCESSOR } from '../../lib/processors/obj-processor';

import styles from './record.scss';
import { Switcher } from '../switcher/switcher';

class GenresClass {
  readonly 'undefined' = '';

  readonly electronic = 'electronic';

  readonly wave = 'wave';

  readonly pop = 'pop';

  readonly 'witch-house' = 'witch-house';

  readonly 'dark wave' = 'dark wave';
}

export const GenresKeeper = OBJ_PROCESSOR.deepFreeze(new GenresClass());
export type Genres = keyof typeof GenresKeeper;

export type DataRecordData = {
  id: string;
  artist?: string;
  title: string;
  releaseDate?: Date;
  imgBase64?: string;
  owned: boolean;
  rating?: number;
  genre?: Genres;
  pinned?: boolean;
  pinnedOrder?: number;
};

export type DataRecordCompParams = {
  full: boolean;
  onChange: (e: React.ChangeEvent, key: keyof DataRecordData) => void;
};

const TEXT_CONTENT_ENG = {
  artistLabel: 'Artist:',
  titleLabel: 'Title:',
  titlePlaceholder: 'Enter title',
  releaseDateLabel: 'Release:',
  ownedLabel: 'Owned:',
  ratingLabel: 'Rating:',
  genreLabel: 'Genre:',
};

export const DataRecord = React.forwardRef(
  (
    props: { data: DataRecordData; params: DataRecordCompParams },
    ref: React.Ref<Validable>,
  ) => {
    const TEXT_CONTENT = TEXT_CONTENT_ENG;

    const titleComp = React.useRef<Validable>(null);

    const validate = (show: boolean): boolean => {
      return !!titleComp.current && titleComp.current.validate(show);
    };

    React.useImperativeHandle(ref, () => ({
      validate,
    }));

    return (
      <div className={styles.wrapper}>
        <fieldset className={styles.root}>
          <ImgUploader
            onChange={e => props.params.onChange(e, 'imgBase64')}
            base64={props.data.imgBase64}
          />
          <label className={styles.root__label}>
            {TEXT_CONTENT.artistLabel}
            <input
              type="text"
              value={props.data.artist}
              onChange={e => props.params.onChange(e, 'artist')}
            ></input>
          </label>
          <DataRecordTitle
            labelText={TEXT_CONTENT.titleLabel}
            placeholderText={TEXT_CONTENT.titlePlaceholder}
            val={props.data.title}
            onChange={e => props.params.onChange(e, 'title')}
            ref={titleComp}
          />
          <label className={styles.root__label}>
            {TEXT_CONTENT.genreLabel}
            <select
              value={props.data.genre}
              onChange={e => props.params.onChange(e, 'genre')}
            >
              {Object.values(GenresKeeper).map(v => {
                return (
                  <option key={v} value={v}>
                    {v}
                  </option>
                );
              })}
            </select>
          </label>
          <label className={styles.root__label}>
            {TEXT_CONTENT.releaseDateLabel}
            <input
              type="date"
              value={props.data.releaseDate?.toISOString().slice(0, 10) || ''}
              min="0001-01-01"
              max="2049-12-31"
              onChange={e => props.params.onChange(e, 'releaseDate')}
            />
          </label>
          <label className={styles.root__label}>
            {TEXT_CONTENT.ownedLabel}
            <input
              type="checkbox"
              checked={props.data.owned}
              onChange={e => props.params.onChange(e, 'owned')}
            />
          </label>
          <label className={styles.root__label}>
            {TEXT_CONTENT.ratingLabel}
            <StarSwitcher
              rootClassName={styles['root__start-switcher']}
              rating={props.data.rating}
              onChange={e => props.params.onChange(e, 'rating')}
            />
          </label>
          <Switcher
            checked={props.data.pinned}
            onChange={e => props.params.onChange(e, 'pinned')}
            uncheckedText="pin"
            checkedText="unpin"
          ></Switcher>
        </fieldset>
      </div>
    );
  },
);

export default DataRecord;
