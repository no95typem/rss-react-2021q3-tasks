import * as React from 'react';
import { Select } from 'antd';
import { WHQuery } from '../../defs';
import { SearchBar } from '../search-bar/search-bar';

import styles from './wh-search-box.scss';
import { WHCategories } from '../../wallheaven-types/categories';
import { WHPurities } from '../../wallheaven-types/purity';
import { WHSortings } from '../../wallheaven-types/sorting';

export interface WHSearchBoxProps {
  query: WHQuery;
  onChange: (val: unknown, key: keyof WHQuery) => void;
  onSubmit: () => void;
}

export const WHSearchBox: React.FC<WHSearchBoxProps> = (
  props: WHSearchBoxProps,
) => {
  return (
    <div>
      <SearchBar
        text={props.query.q}
        onChange={e =>
          props.onChange((e.target as HTMLInputElement).value, 'q')
        }
        onSubmit={() => props.onSubmit()}
      />
      <Select
        mode="multiple"
        value={props.query.categories}
        style={{ width: '100%' }}
        onChange={e => props.onChange(e, 'categories')}
      >
        {Object.keys(WHCategories).map(v => {
          return (
            <Select.Option value={v} key={v}>
              {v}
            </Select.Option>
          );
        })}
      </Select>
      <Select
        mode="multiple"
        value={props.query.purity}
        style={{ width: '100%' }}
        onChange={e => props.onChange(e, 'purity')}
      >
        {Object.keys(WHPurities).map(v => {
          return (
            <Select.Option value={v} key={v}>
              {v}
            </Select.Option>
          );
        })}
      </Select>
      <Select
        value={props.query.sorting}
        style={{ width: '100%' }}
        onChange={e => props.onChange(e, 'sorting')}
      >
        {Object.keys(WHSortings).map(v => {
          return (
            <Select.Option value={v} key={v}>
              {v}
            </Select.Option>
          );
        })}
      </Select>
    </div>
  );
};
