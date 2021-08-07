import * as React from 'react';
import { notification } from 'antd';
import { IconType } from 'antd/lib/notification';

export const openNSFWNotification = (type: IconType): void => {
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

export const openPerPageChangeNotification = (type: IconType): void => {
  notification[type]({
    message: 'Attention!',
    description: `Wallhaven API doesn't allow to change items per page!
      You can do this in your profile settings.
      DO NOT FORGET TO ENTER YOUR API KEY AFTER THAT!`,
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
