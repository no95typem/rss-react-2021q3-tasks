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

type GalletyMemory = {
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

const Gallery: React.FC<GalleryProps> = (props: GalleryProps) => {
  const [query, setQuery] = React.useState<WHQuery>(DEFALUT_WHQUERY);
  const [memory, setMemory] = React.useState<GalletyMemory>({ dataMap: {} });

  // React.useEffect(() => {
  //   console.log(query);
  // }, [query]);

  return (
    <section className={styles.root}>
      <WHSearchBox
        query={query}
        onChange={(val, key) => setQuery(modQuery(query, key, val))}
        onSubmit={() => {
          const data = genFakeData(10);
          console.log('set 1');
          setMemory({ dataMap: data });
          Object.entries(data).forEach(entry => {
            if (!entry[1].src) entry[1].loadSuccess = false;
            else {
              const img = new Image();
              img.onload = () => {
                entry[1].loadSuccess = true;
                console.log('set');
                setMemory({ dataMap: data });
              };
              img.onerror = () => {
                entry[1].loadSuccess = false;
                setMemory({ dataMap: data });
              };
              img.src = entry[1].src;
            }
          });
        }}
      />
      <ContentBox memory={memory.dataMap} />
    </section>
  );
};

export default Gallery;
