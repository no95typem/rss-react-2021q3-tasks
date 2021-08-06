import * as React from 'react';
import { Select, Input, Form } from 'antd';
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
  busy?: boolean;
}

export const WHSearchBox: React.FC<WHSearchBoxProps> = (
  props: WHSearchBoxProps,
) => {
  return (
    <div className={styles.root}>
      <SearchBar
        className={styles['root__search-bar']}
        text={props.query.q}
        onChange={e =>
          props.onChange((e.target as HTMLInputElement).value, 'q')
        }
        onSubmit={() => props.onSubmit()}
        busy={props.busy}
      />
      <div className={styles['root__parameters-box']}>
        <label className={styles.root__parameter}>
          {'Categories:'}
          <Select
            mode="multiple"
            value={props.query.categories}
            style={{ width: '240px' }}
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
        </label>
        <label className={styles.root__parameter}>
          {'Purity:'}
          <Select
            mode="multiple"
            value={props.query.purity}
            style={{ width: '210px' }}
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
        </label>
        <label className={styles.root__parameter}>
          {'Sort by:'}
          <Select
            value={props.query.sorting}
            style={{ width: '115px' }}
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
        </label>
        <label className={styles.root__parameter}>
          {'API key (is required to set items per page):'}
          <Input placeholder="API key" />
        </label>
      </div>
    </div>
  );
};

{
  /* <InputNumber
value={props.query.page}
// formatter={v => {
//   const num = typeof v === 'string' ? Number.parseInt(v, 10) : v;
//   const str = !num && num !== 0 ? '' : num?.toFixed(0);
//   console.log(str);
//   return str;
// }}
// precision={0}
// stringMode={true}
max={24}
min={0}
onChange={v => props.onChange(v, 'page')}
></InputNumber> */
}
