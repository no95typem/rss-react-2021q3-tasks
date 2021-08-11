import * as React from 'react';

import { ContentBox } from '../content-box/content-box';
import { WHSearchBox } from '../wh-search-box/wh-search-box';

import {
  DEFALUT_WHQUERY,
  WHQuery,
  WHPaginationData,
  WHSearchDataItemWithLifecycle,
} from '../../defs';

import styles from './gallery.scss';
import { ImgFetcher } from '../../services/img-fetcher/img-fetcher';
import {
  loadDataFromWH,
  modQuery,
  WHResponseProcessed,
} from '../../services/wh-api/wh-api';

import { genUniqId } from '../../lib/generators/generators';
import { DEFAULT_WH_PER_PAGE_VALUE } from '../../wallheaven-types/pagination';
import { WHSearchDataItem } from '../../wallheaven-types/wh-search-data';
import { LOADERS_CONTEXT, SECRET_CONTEXT } from '../app/contexts';

const fakeImg = require('../../assets/2.jpg');

// FOR REACT-ROUTING
// export interface GalleryProps {
//   memory: Record<string, WHSearchDataItem>;
// }

type GalleryMemory = {
  dataMap: Record<string, WHSearchDataItemWithLifecycle>;
};

/* for debugging purpose */
const genFakeData = (
  count: number,
  query: WHQuery,
): [Record<string, WHSearchDataItem>, WHPaginationData] => {
  const fakeMemory: Record<string, WHSearchDataItem> = {};

  Array(count)
    .fill(null)
    .forEach(() => {
      const obj: WHSearchDataItem = {
        id: genUniqId(),
        thumbs: {
          small: fakeImg.default,
        },
        path: fakeImg.default,
        loadSuccess: undefined,
      } as unknown as WHSearchDataItem;
      fakeMemory[obj.id] = obj;
    });

  const fakePagination: WHPaginationData = {
    current_page: query.page,
    total: count * 100,
    last_page: 100,
    per_page: DEFAULT_WH_PER_PAGE_VALUE,
  };

  return [fakeMemory, fakePagination];
};

const loadData = async (
  query: WHQuery,
  loadImg: (str: string) => Promise<boolean>,
): Promise<WHResponseProcessed> => {
  // const [data, pagination] = await loadDataFromWH(query);
  // throw new Error();
  const [data, pagination] = genFakeData(30, query);
  return new Promise(gRes => {
    const loads = Object.entries(data).map(entry => {
      return new Promise<[string, boolean]>(res => {
        if (!entry[1].thumbs.small) res([entry[1].id, false]);
        else {
          loadImg(entry[1].thumbs.small).then(result => {
            res([entry[1].id, result]);
          });
        }
      });
    });

    setTimeout(() => gRes({ data, loads, pagination }), 1000);
  });
};

const Gallery: React.FC = () => {
  // Может и многовато useState, наверное стоило все в один объект запихнуть memory
  const [query, setQuery] = React.useState<WHQuery>(DEFALUT_WHQUERY);
  const [memory, setMemory] = React.useState<GalleryMemory>({ dataMap: {} });
  const [loads, setLoads] = React.useState<Promise<[string, boolean]>[]>([]);
  const [fetching, setFetching] = React.useState<boolean>(false);
  const [end, setEnd] = React.useState<boolean>(true);
  const [reload, setReload] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);
  const [pagination, setPagination] = React.useState<WHPaginationData>();
  const [searchPerformed, setSearchPerformed] = React.useState<boolean>(false);

  const { loadImg } = React.useContext(LOADERS_CONTEXT);

  const loadNew = (more: boolean, specQuery?: WHQuery) => {
    if (fetching || (more && end)) return;

    setError(false);
    setFetching(true);
    setSearchPerformed(true);

    const q = specQuery || query;

    if (!more) {
      setEnd(false);
      setReload(true);
      setMemory({ dataMap: {} });
    } else q.page++;

    loadData(q, loadImg)
      .then(async response => {
        const newDataMap = more
          ? { ...memory.dataMap, ...response.data }
          : response.data;
        setMemory({ dataMap: newDataMap });
        setPagination(response.pagination);
        setLoads(response.loads);
        setFetching(false);
        if (
          response.loads.length === 0 ||
          response.pagination.last_page === response.pagination.current_page
        )
          setEnd(true); // ! IF SERVER RESPONSE END
      })
      .catch(() => {
        setFetching(false);
        setEnd(true);
        setError(true);
      });
  };

  React.useEffect(() => {
    if (loads.length > 0) {
      setLoads([]);
      loads.forEach(load => {
        load.then(result => {
          const [id, loadSuccess] = result;
          if (memory.dataMap[id]) {
            memory.dataMap[id].loadSuccess = loadSuccess;
            setMemory({ dataMap: memory.dataMap });
          }
        });
      });
    }
    if (reload) setReload(false);
  });

  const { updateApiKey } = React.useContext(SECRET_CONTEXT);

  return (
    <section className={styles.root}>
      <WHSearchBox
        query={query}
        onChange={(val, key) => {
          const newQuery = modQuery(query, key, val);
          if (key === 'apiKey') updateApiKey?.(newQuery.apiKey);
          setQuery(newQuery);
          if (newQuery.page !== query.page) loadNew(false, newQuery);
        }}
        onSubmit={() => loadNew(false)}
        busy={fetching}
        pagination={pagination}
      />
      <ContentBox
        memory={memory.dataMap}
        onScrollEnd={() => loadNew(true)}
        end={end}
        reset={reload}
        error={error}
        loadFullImgCb={loadImg}
        fetching={fetching}
        searchPerformed={searchPerformed}
      />
    </section>
  );
};

export default Gallery;
