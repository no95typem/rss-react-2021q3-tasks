import { Dispatch } from 'redux';
import { WHPaginationData, WHQuery } from '../../../defs';
import { genUniqId } from '../../../lib/generators/generators';
import {
  loadDataFromWH,
  WHResponseProcessed,
} from '../../../services/wh-api/wh-api';
import { DEFAULT_WH_PER_PAGE_VALUE } from '../../../wallheaven-types/pagination';
import { WHSearchDataItem } from '../../../wallheaven-types/wh-search-data';
import { State } from '../../state';
import { setData } from './setData';
import { setFlag } from './setFlag';
import { setPagination } from './setPagination';

/* for debugging purpose */

const fakeImg = require('../../../assets/2.jpg');

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

const loadFakeData = async (query: WHQuery) => {
  if (query.q === 'ERROR') throw new Error();
  const data = genFakeData(30, query);
  return data;
};

const loadDataFunc: (
  query: WHQuery,
) => Promise<[Record<string, WHSearchDataItem>, WHPaginationData]> =
  // loadFakeData;
  process.env.NODE_ENV === 'test' ? loadFakeData : loadDataFromWH;

const setTestLoadResultFunc: (result: boolean) => boolean =
  process.env.NODE_ENV === 'test'
    ? (result: boolean) => true
    : (result: boolean) => result;

const loadData = async (
  query: WHQuery,
  loadImg: (str: string) => Promise<boolean>,
): Promise<WHResponseProcessed> => {
  const [data, pagination] = await loadDataFunc(query);
  const loads = Object.entries(data).map(entry => {
    return new Promise<[string, boolean]>(res => {
      if (!entry[1].thumbs.small)
        res([entry[1].id, setTestLoadResultFunc(false)]);
      else {
        loadImg(entry[1].thumbs.small).then(result => {
          res([entry[1].id, setTestLoadResultFunc(result)]);
        });
      }
    });
  });
  return { data, loads, pagination };
};

export const FetchSearch = (more: boolean, specQuery?: WHQuery) => {
  return (dispatch: Dispatch, getState: () => State): void => {
    const state = getState();
    const { loadImg } = state.coreState.imgFetcher;
    const { flags } = state.galleryState;
    const query = specQuery || state.galleryState.query;
    if (flags.fetching || (more && flags.end)) return;

    dispatch(setFlag('error', false));
    dispatch(setFlag('fetching', true));
    dispatch(setFlag('searchPerformed', true));

    if (!more) {
      dispatch(setFlag('end', false));
      dispatch(setData({}));
    } else query.page++;

    loadData(query, loadImg)
      .then(async response => {
        const newDataMap = more
          ? { ...state.galleryState.dataMap, ...response.data }
          : response.data;
        dispatch(setData(newDataMap));
        dispatch(setPagination(response.pagination));
        dispatch(setFlag('fetching', false));
        if (
          response.loads.length === 0 ||
          response.pagination.last_page === response.pagination.current_page
        ) {
          dispatch(setFlag('end', true));
        }
        response.loads.forEach(load => {
          load.then(result => {
            const [id, loadSuccess] = result;
            const currState = getState().galleryState;
            if (currState.dataMap[id]) {
              currState.dataMap[id].loadSuccess = loadSuccess;
              dispatch(setData(currState.dataMap));
            }
          });
        });
      })
      .catch(() => {
        dispatch(setFlag('fetching', false));
        dispatch(setFlag('end', true));
        dispatch(setFlag('error', true));
      });
  };
};
