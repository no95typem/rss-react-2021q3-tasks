import { CORS_PROXY, WHImageData, WHPagination, WHQuery } from '../../defs';
import { OBJ_PROCESSOR } from '../../lib/processors/obj-processor';
import { WHCategoriesList } from '../../wallheaven-types/categories';
import { WHPurityList } from '../../wallheaven-types/purity';
import { WHSorting } from '../../wallheaven-types/sorting';
// import { openNSFWNotification } from '../open-notification/open-notification';

export type WHResponseProcessed = {
  data: Record<string, WHImageData>;
  loads: Promise<[string, boolean]>[];
  pagination: WHPagination;
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
  return `${CORS_PROXY}http://wallhaven.cc/api/v1/${queryStr}`;
};

export const modQuery = (
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
    ) {
      // openNSFWNotification('error');
    } else newQuery[key] = val as WHPurityList;
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

export const loadDataFromWH = (
  query: WHQuery,
): Promise<[Record<string, WHImageData>, WHPagination]> => {
  return new Promise<[Record<string, WHImageData>, WHPagination]>(
    (res, rej) => {
      const fetchStr = calcWHQueryStr(query);
      fetch(fetchStr)
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('x');
        })
        .then(json => {
          const obj = json as Record<string, unknown>;
          const dataObj: Record<string, WHImageData> = {};
          (obj.data as Record<string, unknown>[]).forEach(it => {
            const item = it as Record<string, string>;
            const data: WHImageData = {
              id: item.id,
              src: item.thumbs.small as unknown as string,
              path: item.path as unknown as string,
            };
            dataObj[data.id] = data;
          });
          const meta = obj.meta as Record<string, unknown>;
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
