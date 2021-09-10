import { API_URL, WHPaginationData, WHQuery } from '../../defs';
import { OBJ_PROCESSOR } from '../../lib/processors/obj-processor';
import { WHCategoriesList } from '../../../shared/wallheaven-types/categories';
import { WHPurityList } from '../../../shared/wallheaven-types/purity';
import { WHSorting } from '../../../shared/wallheaven-types/sorting';
import {
  WHSearchDataItem,
  WHSearchResponse,
} from '../../../shared/wallheaven-types/wh-search-data';
import { openNSFWNotification } from '../open-notification/open-notification';
import { ProxyReqCodes } from '../../../shared/proxy.def';

export type WHResponseProcessed = {
  data: Record<string, WHSearchDataItem>;
  loads: Promise<[string, boolean]>[];
  pagination: WHPaginationData;
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

export const calcWHQueryStr = (query: WHQuery): string => {
  const { q } = query;
  const categories = calcCategoryQuery(query);
  const purity = calcPurityQuery(query);
  const filtersStr = `&categories=${categories}&purity=${purity}`;
  const apiKeyStr = query.apiKey ? `&apikey=${query.apiKey}` : '';
  const pageStr = `&page=${query.page}`;
  return `search?q=${q}${filtersStr}&sorting=${query.sorting}${pageStr}${apiKeyStr}`;
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
      openNSFWNotification();
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

const HTTP_REQ_INIT: RequestInit | undefined =
  process.env.NODE_ENV === 'test'
    ? {
        referrerPolicy: 'no-referrer',
        headers: {
          Origin: 'http://localhost:8080',
        },
      }
    : undefined;

export const getWHSearch = (
  query: WHQuery,
): Promise<[Record<string, WHSearchDataItem>, WHPaginationData]> => {
  return new Promise<[Record<string, WHSearchDataItem>, WHPaginationData]>(
    (res, rej) => {
      const fetchStr = calcWHQueryStr(query);
      fetch(API_URL, {
        ...HTTP_REQ_INIT,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: ProxyReqCodes.WHSearch, fetchStr }),
      })
        .then(response => {
          if (response.ok) return response.json();
          throw new Error('x');
        })
        .then(json => {
          const obj = json as WHSearchResponse;
          const dataObj: Record<string, WHSearchDataItem> = {};
          obj.data.forEach(it => {
            dataObj[it.id] = it;
          });
          const pagination: WHPaginationData = {
            current_page: obj.meta.current_page,
            last_page: obj.meta.last_page,
            total: obj.meta.total,
            per_page: obj.meta.per_page,
          };
          res([dataObj, pagination]);
        })
        .catch(e => rej(e));
    },
  );
};
