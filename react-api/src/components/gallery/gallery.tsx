import * as React from 'react';
import { notification } from 'antd';
import { IconType } from 'antd/lib/notification';
import { DEFALUT_WHQUERY, WHQuery, WHPagination } from '../../defs';
import { OBJ_PROCESSOR } from '../../lib/processors/obj-processor';
import { genUniqId } from '../../lib/generators/generators';
import { WHCategoriesList } from '../../wallheaven-types/categories';
import { WHPurityList } from '../../wallheaven-types/purity';
import { WHSorting } from '../../wallheaven-types/sorting';
import { ContentBox } from '../content-box/content-box';
import { DataRecordData } from '../record/record';
import { WHSearchBox } from '../wh-search-box/wh-search-box';
import { QueueManager } from '../../lib/misc/queue-manager';

import styles from './gallery.scss';

const fakeImg = require('../../assets/2.jpg');

const WALLHAVEN_WINDOW = 60000;
const WALLHAVEN_REQ_PER_WINDOW = 700;

const IMG_LOAD_QUEUE_MANAGER = new QueueManager<boolean>(
  async (reqPerWindow: number, firstTimeInWindow: number) => {
    const throttleTime =
      reqPerWindow >= WALLHAVEN_REQ_PER_WINDOW
        ? WALLHAVEN_WINDOW - (Date.now() - firstTimeInWindow)
        : 0;
    await new Promise(res => setTimeout(res, throttleTime));
  },
  WALLHAVEN_WINDOW,
);

export interface GalleryProps {
  memory: Record<string, DataRecordData>;
}

type GalleryMemory = {
  dataMap: Record<string, DataRecordData>;
};

const loadImg = (src: string) => {
  const action = async () => {
    return new Promise<boolean>(res => {
      const img = new Image();
      img.onload = () => res(true);
      img.onerror = () => res(false);

      img.referrerPolicy = 'no-referrer'; // !
      img.src = src;
    });
  };
  return IMG_LOAD_QUEUE_MANAGER.do(action);
};

const openNSFWNotification = (type: IconType) => {
  notification[type]({
    message: 'Woo!',
    description: `Wallhaven requires API key for NSFW content!
      Copy your API key and enter it first!
      DO NOT FORGET TO ALLOW NSFW IN RESULTS IN ACCOUNT SETTINGS!`,
    btn: (
      <a
        href="https://wallhaven.cc/settings/account"
        target="_blank"
        rel="noreferrer"
      >
        Go to wallhaven profile settings
      </a>
    ),
  });
};

const modQuery = (
  query: WHQuery,
  key: keyof WHQuery,
  val: unknown,
): WHQuery => {
  const newQuery = OBJ_PROCESSOR.deepClone(query);
  if (key === 'q') newQuery[key] = val as string;
  else if (key === 'categories') newQuery[key] = val as WHCategoriesList;
  else if (key === 'purity') {
    if (
      (val as WHPurityList).includes('nsfw') &&
      (!query.apiKey || query.apiKey === '')
    )
      openNSFWNotification('error');
    else newQuery[key] = val as WHPurityList;
  } else if (key === 'sorting') newQuery[key] = val as WHSorting;
  else if (key === 'page') {
    const int = Number.parseInt(`${val}`, 10);
    if (!Number.isNaN(int)) newQuery[key] = int;
  } else if (key === 'apiKey') {
    newQuery[key] = val as string;
    if (val === '' && query.purity.includes('nsfw'))
      newQuery.purity = query.purity.filter(item => item !== 'nsfw');
  }
  return newQuery;
};

const genFakeData = (
  count: number,
  query: WHQuery,
): [Record<string, DataRecordData>, WHPagination] => {
  const fakeMemory: Record<string, DataRecordData> = {};

  Array(count)
    .fill(null)
    .forEach(() => {
      const obj: DataRecordData = {
        id: genUniqId(),
        src: fakeImg.default,
        path: fakeImg.default,
        loadSuccess: undefined,
      };
      fakeMemory[obj.id] = obj;
    });

  const fakePagination: WHPagination = {
    current_page: query.page,
    total: count * 100,
    last_page: 100,
    per_page: count,
  };

  return [fakeMemory, fakePagination];
};

const calcCategoryQuery = (query: WHQuery): string => {
  const general = query.categories.includes('general') ? 1 : 0;
  const anime = query.categories.includes('anime') ? 1 : 0;
  const people = query.categories.includes('people') ? 1 : 0;
  return `${general}${anime}${people}`;
};

const calcPurityQuery = (query: WHQuery): string => {
  const sfw = query.purity.includes('sfw') ? 1 : 0;
  const sketchy = query.purity.includes('sketchy') ? 1 : 0;
  const nsfw = query.purity.includes('nsfw') ? 1 : 0;
  return `${sfw}${sketchy}${nsfw}`;
};

const calcWHQueryStr = (query: WHQuery): string => {
  const { q } = query;
  const categories = calcCategoryQuery(query);
  const purity = calcPurityQuery(query);
  const filtersStr = `&categories=${categories}&purity=${purity}`;
  const apiKeyStr = query.apiKey ? `&apikey=${query.apiKey}` : '';
  const pageStr = `&page=${query.page}`;
  const queryStr = `search?q=${q}${filtersStr}&sorting=${query.sorting}${pageStr}${apiKeyStr}`;
  return `http://localhost:3020/http://wallhaven.cc/api/v1/${queryStr}`;
  // return `http://wallhaven.cc/api/v1/${queryStr}`;
};

const loadDataFromWH = (
  query: WHQuery,
): Promise<[Record<string, DataRecordData>, WHPagination]> => {
  return new Promise<[Record<string, DataRecordData>, WHPagination]>(
    (res, rej) => {
      const fetchStr = calcWHQueryStr(query);
      fetch(fetchStr)
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('x');
        })
        .then(json => {
          const obj = json as Record<string, unknown>;
          const dataObj: Record<string, DataRecordData> = {};
          (obj.data as Record<string, unknown>[]).forEach(it => {
            const item = it as Record<string, string>;
            const data: DataRecordData = {
              id: item.id,
              src: item.thumbs.small as unknown as string,
              path: item.path as unknown as string,
            };
            dataObj[data.id] = data;
          });
          const meta = obj.meta as Record<string, unknown>;
          console.log(meta);
          const pagination: WHPagination = {
            current_page: meta.current_page as number,
            last_page: meta.last_page as number,
            total: meta.total as number,
            per_page: meta.per_page as number,
          };
          res([dataObj, pagination]);
        })
        .catch(e => rej(e));
    },
  );
};

type WHResponseProcessed = {
  data: Record<string, DataRecordData>;
  loads: Promise<[string, boolean]>[];
  pagination: WHPagination;
};

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

type ReactHookSetter<T> = React.Dispatch<React.SetStateAction<T>>;

const Gallery: React.FC<GalleryProps> = (props: GalleryProps) => {
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
