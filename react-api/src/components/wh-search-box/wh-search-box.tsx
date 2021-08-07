import * as React from 'react';
import { Select, Input, Pagination } from 'antd';

import { SearchBar } from '../search-bar/search-bar';
import { WHCategories } from '../../wallheaven-types/categories';
import { WHPurities } from '../../wallheaven-types/purity';
import { WHSortings } from '../../wallheaven-types/sorting';
import { openPerPageChangeNotification } from '../../services/open-notification/open-notification';

import { WHPagination, WHQuery } from '../../defs';

import styles from './wh-search-box.scss';

export interface WHSearchBoxProps {
  query: WHQuery;
  onChange: (val: unknown, key: keyof WHQuery) => void;
  onSubmit: () => void;
  busy?: boolean;
  pagination?: WHPagination;
}

const CATEGORIES_SELECT_GOOD_WIDTH = '240px';
const PURITY_SELECT_GOOD_WIDTH = '210px';
const SORT_SELECT_GOOD_WIDTH = '115px';

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
      <div className={styles['root__ctls-box']}>
        <div className={styles['root__parameters-box']}>
          <label className={styles.root__parameter}>
            {'Categories:'}
            <Select
              mode="multiple"
              value={props.query.categories}
              style={{ width: CATEGORIES_SELECT_GOOD_WIDTH }}
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
              style={{ width: PURITY_SELECT_GOOD_WIDTH }}
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
              style={{ width: SORT_SELECT_GOOD_WIDTH }}
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
            <Input
              placeholder="API key"
              value={props.query.apiKey || ''}
              onChange={v => props.onChange(v.target.value, 'apiKey')}
            />
          </label>
        </div>
        <Pagination
          disabled={!props.pagination}
          hideOnSinglePage
          current={props.pagination?.current_page || 1}
          total={props.pagination?.total || 0}
          pageSize={props.pagination?.per_page || 10}
          showQuickJumper
          onChange={v => props.onChange(v, 'page')}
          onShowSizeChange={() => openPerPageChangeNotification('warning')}
          showTotal={total => `Found ${total} pictures`}
        />
      </div>
    </div>
  );
};
