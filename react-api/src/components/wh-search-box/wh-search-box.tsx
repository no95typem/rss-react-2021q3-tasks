import * as React from 'react';

import { SearchBar } from '../search-bar/search-bar';
import { WHCategories } from '../../wallheaven-types/categories';
import { WHPurities } from '../../wallheaven-types/purity';
import { WHSortings } from '../../wallheaven-types/sorting';
// import { openPerPageChangeNotification } from '../../services/open-notification/open-notification';

import { WHPaginationData, WHQuery } from '../../defs';

import styles from './wh-search-box.scss';
import { TagSelect } from '../tag-select/tag-select';
import { Select } from '../select/select';
import { Pagination } from '../pagination/pagination';
import { BootstrapModal } from '../../lib/react/components/bootstrap-modal';
import { genUniqId } from '../../lib/generators/generators';
import { DEFAULT_WH_PER_PAGE_VALUE } from '../../wallheaven-types/pagination';

export interface WHSearchBoxProps {
  query: WHQuery;
  onChange: (val: unknown, key: keyof WHQuery) => void;
  onSubmit: () => void;
  busy?: boolean;
  pagination?: WHPaginationData;
}

export const WHSearchBox: React.FC<WHSearchBoxProps> = (
  props: WHSearchBoxProps,
) => {
  const [perPageError, setPerPageError] = React.useState(false);

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
        <Pagination
          disabled={props.busy}
          current={props.pagination?.current_page}
          total={props.pagination?.total}
          perPage={Number.parseInt(
            (props.pagination?.per_page || DEFAULT_WH_PER_PAGE_VALUE) as string,
            10,
          )}
          onChange={v => props.onChange(v, 'page')}
          onPerPageChange={v => setPerPageError(true)}
          maxBtns={10}
        />
        {perPageError ? (
          <BootstrapModal
            id={genUniqId()}
            ariaLabel="Settings change error"
            title="Settings change error"
            body="Wallhaven API doesn't allow to change items per page!
                  You can do this in your profile settings.
                  DO NOT FORGET TO ENTER YOUR API KEY AFTER THAT!"
            btnText="Go to settings"
            onClose={() => setPerPageError(false)}
            onOk={() => {
              setPerPageError(false);
              const a = document.createElement('a');
              a.href = 'https://wallhaven.cc/settings/account';
              a.target = '_blank';
              a.referrerPolicy = 'noreferrer';
              a.click();
            }}
          />
        ) : undefined}
      </div>
    </div>
  );
};
