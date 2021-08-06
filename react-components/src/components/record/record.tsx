/* eslint-disable react/display-name */
import * as React from 'react';
import { ImgUploader } from '../img-loader/extenders/img-uploader/img-uploader';
import { ValidableTextInput } from './title/title';
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
  artist: string;
  title: string;
  releaseDate: Date;
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
  artistPlaceholder: 'Enter artist name',
  titleLabel: 'Title:',
  titlePlaceholder: 'Enter title',
  releaseDateLabel: 'Release:',
  releaseDateError: 'Please enter a valid date (from 01.01.0001 to 31.12.2049)',
  ownedLabel: 'Owned:',
  ratingLabel: 'Rating:',
  genreLabel: 'Genre:',
  genreError: 'Please choose a genre from the list',
};

export const DataRecord = React.forwardRef(
  (
    props: { data: DataRecordData; params: DataRecordCompParams },
    ref: React.Ref<Validable>,
  ) => {
    const TEXT_CONTENT = TEXT_CONTENT_ENG;

    const artistComp = React.useRef<Validable>(null);
    const titleComp = React.useRef<Validable>(null);
    const genreSelect = React.useRef<HTMLSelectElement>(null);
    const dateInput = React.useRef<HTMLInputElement>(null);

    const validateGenre = (show: boolean): boolean => {
      if (!genreSelect.current) return false;

      const valid = genreSelect.current.value in GenresKeeper;

      if (!valid && show) {
        genreSelect.current.setCustomValidity(TEXT_CONTENT.genreError);
        genreSelect.current.reportValidity();
      }

      return valid;
    };

    const validateDate = (show: boolean): boolean => {
      if (!dateInput.current) return false;

      const valid =
        dateInput.current.validity.valid &&
        !Number.isNaN(Date.parse(dateInput.current.value));

      if (!valid && show) {
        dateInput.current.setCustomValidity(TEXT_CONTENT.releaseDateError);
        dateInput.current.reportValidity();
      }

      return valid;
    };

    const validate = (show: boolean): boolean => {
      return (
        !!artistComp.current &&
        artistComp.current.validate(show) &&
        !!titleComp.current &&
        titleComp.current.validate(show) &&
        validateGenre(show) &&
        validateDate(show)
      );
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
          <ValidableTextInput
            labelText={TEXT_CONTENT.artistLabel}
            placeholderText={TEXT_CONTENT.artistPlaceholder}
            val={props.data.artist}
            onChange={e => props.params.onChange(e, 'artist')}
            ref={artistComp}
          />
          <ValidableTextInput
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
              ref={genreSelect}
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
              ref={dateInput}
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
