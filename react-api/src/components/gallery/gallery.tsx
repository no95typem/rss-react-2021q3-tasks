import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { State } from '../../store/state';
import { setQuery } from '../../store/actions/gallery/setQuery';
import { FetchSearch } from '../../store/actions/gallery/fetch';
import { setContentScrollTop } from '../../store/actions/gallery/setContentScrollTop';
import { setApiKey } from '../../store/actions/core/setApiKey';

import { ContentBox } from '../content-box/content-box';
import { WHSearchBox } from '../wh-search-box/wh-search-box';
import { modQuery } from '../../services/wh-api/wh-api';

import styles from './gallery.scss';

export type GalleryProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

const Gallery: React.FC<GalleryProps> = (props: GalleryProps) => {
  const { flags, dataMap, query, paginationData, contentScrollTop } =
    props.galleryState;

  return (
    <section className={styles.root}>
      <WHSearchBox
        query={query}
        onChange={(val, key) => {
          const newQuery = modQuery(query, key, val);
          if (key === 'apiKey') props.setApiKey(newQuery.apiKey);
          props.setQuery(newQuery);
          if (newQuery.page !== query.page) props.Fetch(false, newQuery);
        }}
        onSubmit={() => props.Fetch(false)}
        busy={flags.fetching}
        pagination={paginationData}
      />
      <ContentBox
        memory={dataMap}
        onScrollEnd={() => props.Fetch(true)}
        end={flags.end}
        error={flags.error}
        fetching={flags.fetching}
        searchPerformed={flags.searchPerformed}
        scrollTop={contentScrollTop}
        onScroll={v => props.setContentScrollTop(v)}
      />
    </section>
  );
};

const mapStateToProps = (store: State) => {
  return {
    galleryState: store.galleryState,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setQuery,
      Fetch: FetchSearch,
      setContentScrollTop,
      setApiKey,
    },
    dispatch,
  );

export const GalleryReduxed = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Gallery);
