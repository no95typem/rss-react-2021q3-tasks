import * as React from 'react';
import { DEFALUT_WHQUERY, WHQuery } from '../../defs';
import { OBJ_PROCESSOR } from '../../lib/processors/obj-processor';
import { genUniqId } from '../../lib/generators/generators';
import { WHCategoriesList } from '../../wallheaven-types/categories';
import { WHPurityList } from '../../wallheaven-types/purity';
import { WHSorting } from '../../wallheaven-types/sorting';
import { ContentBox } from '../content-box/content-box';
import { DataRecordData } from '../record/record';
import { WHSearchBox } from '../wh-search-box/wh-search-box';

import styles from './gallery.scss';

const fakeImg = require('../../assets/2.jpg');

export interface GalleryProps {
  memory: Record<string, DataRecordData>;
}

type GalleryMemory = {
  dataMap: Record<string, DataRecordData>;
};

const modQuery = (
  query: WHQuery,
  key: keyof WHQuery,
  val: unknown,
): WHQuery => {
  const newQuery = OBJ_PROCESSOR.deepClone(query);
  if (key === 'q') newQuery[key] = val as string;
  else if (key === 'categories') newQuery[key] = val as WHCategoriesList;
  else if (key === 'purity') newQuery[key] = val as WHPurityList;
  else if (key === 'sorting') newQuery[key] = val as WHSorting;
  else if (key === 'page') {
    const int = Number.parseInt(`${val}`, 10);
    if (!Number.isNaN(int)) newQuery[key] = int;
  }
  return newQuery;
};

const genFakeData = (count: number): Record<string, DataRecordData> => {
  const fakeMemory: Record<string, DataRecordData> = {};

  Array(count)
    .fill(null)
    .forEach(() => {
      const obj: DataRecordData = {
        id: genUniqId(),
        src: fakeImg.default,
        loadSuccess: undefined,
      };
      fakeMemory[obj.id] = obj;
    });
  return fakeMemory;
};

const loadFakeData = (): Promise<
  [Record<string, DataRecordData>, Promise<[string, boolean]>[]]
> => {
  return new Promise(gRes => {
    const data = genFakeData(30);

    const loads = Object.entries(data).map(entry => {
      return new Promise<[string, boolean]>(res => {
        if (!entry[1].src) res([entry[1].id, false]);
        else {
          const img = new Image();
          img.onload = () => {
            setTimeout(() => res([entry[1].id, true]), Math.random() * 3000);
          };
          img.onerror = () => {
            res([entry[1].id, false]);
          };
          img.src = entry[1].src;
        }
      });
    });

    setTimeout(() => gRes([data, loads]), 1000);
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

  const loadNew = (more: boolean) => {
    console.log(fetching);
    if (fetching) return;
    setFetching(true);
    console.log('set true');
    if (!more) {
      setEnd(false);
      setReload(true);
      setMemory({ dataMap: {} });
    }
    const test = Math.random() > 0.5;
    if (more && (test || end)) {
      setEnd(true);
      return;
    }

    loadFakeData().then(tuple => {
      const newDataMap = more ? { ...memory.dataMap, ...tuple[0] } : tuple[0];
      setMemory({ dataMap: newDataMap });
      setLoads(tuple[1]);
      console.log('set false');
      setFetching(false);
      if (tuple[1].length === 0) setEnd(true); // ! IF SERVER RESPONSE END
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
        onChange={(val, key) => setQuery(modQuery(query, key, val))}
        onSubmit={() => loadNew(false)}
        busy={fetching}
      />
      <ContentBox
        memory={memory.dataMap}
        onScrollEnd={() => loadNew(true)}
        end={end}
        reset={reload}
      />
    </section>
  );
};

export default Gallery;
