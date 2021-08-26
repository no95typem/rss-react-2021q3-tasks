import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import { genUniqId } from '../../lib/generators/generators';
import { BootstrapModal } from '../../lib/react/components/modals/bootstrap-modal';

export const openNSFWNotification = () => {
  const div = document.createElement('div');
  // document.body.append(div);
  const onClose = () => {
    ReactDOM.render(<></>, div);
    div.remove();
  };
  const elem = (
    <BootstrapModal
      classNameStr="animate__animated animate__fadeIn"
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
    />
  );
  ReactDOM.render(elem, div);
};
