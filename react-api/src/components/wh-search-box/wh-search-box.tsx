import * as React from 'react';

import { SearchBar } from '../search-bar/search-bar';
import { WHCategories } from '../../wallheaven-types/categories';
import { WHPurities } from '../../wallheaven-types/purity';
import { WHSortings } from '../../wallheaven-types/sorting';
// import { openPerPageChangeNotification } from '../../services/open-notification/open-notification';

import { WHPagination, WHQuery } from '../../defs';

import styles from './wh-search-box.scss';
import { TagSelect } from '../tag-select/tag-select';
import { Select } from '../select/select';
import { Pagination } from '../pagination/pagination';

export interface WHSearchBoxProps {
  query: WHQuery;
  onChange: (val: unknown, key: keyof WHQuery) => void;
  onSubmit: () => void;
  busy?: boolean;
  pagination?: WHPagination;
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
      <div className={styles['root__ctls-box']}>
        <div className={styles['root__parameters-box']}>
          <div className={styles.root__parameter}>
            {'Categories:'}
            <TagSelect
              value={props.query.categories}
              aria-label={'Categories checkbox toogle button group'}
              options={Object.keys(WHCategories).map(v => {
                return { value: v, text: v };
              })}
              onChange={val => props.onChange(val, 'categories')}
            />
          </div>
          <div className={styles.root__parameter}>
            {'Purity:'}
            <TagSelect
              value={props.query.purity}
              aria-label={'Purity checkbox toogle button group'}
              options={Object.keys(WHPurities).map(v => {
                return { value: v, text: v };
              })}
              onChange={val => props.onChange(val, 'purity')}
            />
          </div>
          <label className={styles.root__parameter}>
            {'Sort by:'}
            <Select
              value={props.query.sorting}
              aria-label="Sorting select"
              onChange={v => props.onChange(v, 'sorting')}
              options={Object.keys(WHSortings).map(v => {
                return { value: v, text: v };
              })}
            />
          </label>
          <label className={styles.root__parameter}>
            {'API key (is required to set items per page):'}
            <input
              className="form-control"
              placeholder="API key"
              value={props.query.apiKey || ''}
              onChange={v => props.onChange(v.target.value, 'apiKey')}
            />
          </label>
        </div>
        {/* <Pagination
          disabled={!props.pagination}
          hideOnSinglePage
          current={props.pagination?.current_page || 1}
          total={props.pagination?.total || 0}
          pageSize={props.pagination?.per_page || 10}
          showQuickJumper
          onChange={v => props.onChange(v, 'page')}
          onShowSizeChange={() => openPerPageChangeNotification('warning')}
          showTotal={total => `Found ${total} pictures`}
        /> */}
        <Pagination
          disabled={props.busy}
          current={props.pagination?.current_page}
          total={props.pagination?.total}
          perPage={props.pagination?.per_page}
          onChange={v => props.onChange(v, 'page')}
          maxBtns={10}
        />
      </div>
    </div>
  );
};
