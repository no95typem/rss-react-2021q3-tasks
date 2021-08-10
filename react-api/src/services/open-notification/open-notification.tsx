import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { genUniqId } from '../../lib/generators/generators';
import { BootstrapModal } from '../../lib/react/components/bootstrap-modal';

export const openNSFWNotification = () => {
  const div = document.createElement('div');
  document.body.append(div);
  const onClose = () => {
    ReactDOM.render(<></>, div);
    div.remove();
  };
  const elem = ReactDOM.createPortal(
    <BootstrapModal
      id={genUniqId()}
      ariaLabel="Settings change error"
      title="Settings change error"
      body="Wallhaven requires API key for NSFW content!
            Copy your API key and enter it first!
            DO NOT FORGET TO ALLOW NSFW IN RESULTS IN ACCOUNT SETTINGS!"
      btnText="Go to settings"
      onClose={() => onClose()}
      onOk={() => {
        onClose();
        const a = document.createElement('a');
        a.href = 'https://wallhaven.cc/settings/account';
        a.target = '_blank';
        a.referrerPolicy = 'noreferrer';
        a.click();
      }}
    />,
    document.body,
  );
  ReactDOM.render(elem, div);
};
