import { Dispatch } from 'redux';
import { API_URL } from '../../../defs';
import { WHWallpaperData } from '../../../../shared/wallheaven-types/wh-wallpaper-data';
import { State } from '../../state';
import { setData } from './setData';
import { setFlag } from './setFlag';
import { ProxyReqCodes } from '../../../../shared/proxy.def';

export const fetchById = (id: string) => {
  return (dispatch: Dispatch, getState: () => State): void => {
    const { apiKey, imgFetcher } = getState().coreState;
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: ProxyReqCodes.WHWpInfo, id, apiKey }),
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error('');
      })
      .then(json => {
        const data = json.data as WHWallpaperData;
        dispatch(setData(data));
        console.log(data);
        imgFetcher.loadImg(data.path).then(result => {
          console.log(result);
          // setTimeout(() => {
          dispatch(setFlag('imgPreloaded', result));
          // }, 2000);
        });
        dispatch(setFlag('dataLoaded', true));
      })
      .catch(err => {
        console.log(err);
        dispatch(setFlag('dataLoaded', false));
      });
  };
};
