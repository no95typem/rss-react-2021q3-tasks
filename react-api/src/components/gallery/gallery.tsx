import * as React from 'react';

import { ContentBox } from '../content-box/content-box';
import { WHSearchBox } from '../wh-search-box/wh-search-box';

import {
  DEFALUT_WHQUERY,
  WHQuery,
  WHPagination,
  WHImageData,
} from '../../defs';

import styles from './gallery.scss';
import { ImgFetcher } from '../../services/img-fetcher/img-fetcher';
import {
  loadDataFromWH,
  modQuery,
  WHResponseProcessed,
} from '../../services/wh-api/wh-api';

// const fakeImg = require('../../assets/2.jpg');

const WALLHAVEN_WINDOW = 60000;
const WALLHAVEN_REQ_PER_WINDOW = 700; // ! in fact 45 req per min for API, for images I don't know...

const { loadImg } = new ImgFetcher(WALLHAVEN_REQ_PER_WINDOW, WALLHAVEN_WINDOW);

// FOR REACT-ROUTING
export interface GalleryProps {
  memory: Record<string, WHImageData>;
}

type GalleryMemory = {
  dataMap: Record<string, WHImageData>;
};

/* for debugging purpose */
// const genFakeData = (
//   count: number,
//   query: WHQuery,
// ): [Record<string, DataRecordData>, WHPagination] => {
//   const fakeMemory: Record<string, DataRecordData> = {};

//   Array(count)
//     .fill(null)
//     .forEach(() => {
//       const obj: DataRecordData = {
//         id: genUniqId(),
//         src: fakeImg.default,
//         path: fakeImg.default,
//         loadSuccess: undefined,
//       };
//       fakeMemory[obj.id] = obj;
//     });

//   const fakePagination: WHPagination = {
//     current_page: query.page,
//     total: count * 100,
//     last_page: 100,
//     per_page: count,
//   };

//   return [fakeMemory, fakePagination];
// };

const loadData = async (query: WHQuery): Promise<WHResponseProcessed> => {
  const [data, pagination] = await loadDataFromWH(query);
  // const [data, pagination] = genFakeData(30, query);
  return new Promise(gRes => {
    const loads = Object.entries(data).map(entry => {
      return new Promise<[string, boolean]>(res => {
        if (!entry[1].src) res([entry[1].id, false]);
        else {
          loadImg(entry[1].src).then(result => {
            res([entry[1].id, result]);
          });
        }
      });
    });

    setTimeout(() => gRes({ data, loads, pagination }), 1000);
  });
};

const Gallery: React.FC<GalleryProps> = (props: GalleryProps) => {
  // Может и многовато useState, наверное стоило все в один объект запихнуть memory
  const [query, setQuery] = React.useState<WHQuery>(DEFALUT_WHQUERY);
  const [memory, setMemory] = React.useState<GalleryMemory>({ dataMap: {} });
  const [loads, setLoads] = React.useState<Promise<[string, boolean]>[]>([]);
  const [fetching, setFetching] = React.useState<boolean>(false);
  const [end, setEnd] = React.useState<boolean>(true);
  const [reload, setReload] = React.useState<boolean>(true);
  const [error, setError] = React.useState<boolean>(false);
  const [pagination, setPagination] = React.useState<WHPagination>();

  const loadNew = (more: boolean, specQuery?: WHQuery) => {
    if (fetching || (more && end)) return;

    setError(false);
    setFetching(true);

    const q = specQuery || query;

    if (!more) {
      setEnd(false);
      setReload(true);
      setMemory({ dataMap: {} });
    } else q.page++;

    loadData(q)
      .then(async response => {
        await new Promise(res => setTimeout(res, 1000));
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

  return (
    <section className={styles.root}>
      <WHSearchBox
        query={query}
        onChange={(val, key) => {
          const newQuery = modQuery(query, key, val);
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
      />
    </section>
  );
};

export default Gallery;
