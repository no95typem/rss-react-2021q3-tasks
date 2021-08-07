import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { genUniqId } from '../../../../lib/generators/generators';

import { ImgLoader, ImgLoaderProps, ImgLoaderState } from '../../img-loader';

import styles from './img-uploader.scss';

interface ImgUploaderState extends ImgLoaderState {
  opened: boolean;
}

export class ImgUploader extends ImgLoader<ImgLoaderProps> {
  static readonly TEXT_CONTENT_ENG = {
    btnUpload: 'Upload',
    btnClear: 'Delete',
  };

  state: ImgUploaderState;

  private TEXT_CONTENT = ImgUploader.TEXT_CONTENT_ENG;

  private collapseId = genUniqId();

  constructor(props: ImgLoaderProps) {
    super(props);
    this.state.opened = false;
  }

  shouldComponentUpdate(
    nextProps: ImgLoaderProps,
    nextState: ImgUploaderState,
  ): boolean {
    return (
      super.shouldComponentUpdate(nextProps, nextState) ||
      this.state.opened !== nextState.opened
    );
  }

  render(): JSX.Element {
    return (
      <div className={styles.root}>
        {super.render()}
        <div className={styles['root__btn-layer']}>
          <button
            className={styles.root__btn}
            aria-controls={this.collapseId}
            onClick={e => {
              e.preventDefault();
              this.setState({ opened: !this.state.opened });
            }}
          >
            {this.state.opened ? 'Collapse' : 'Change'}
          </button>
          <div id={this.collapseId}>
            <div className={styles.root__collapsable}>
              {' '}
              <button>
                <label>
                  {this.TEXT_CONTENT.btnUpload}
                  <input
                    className={styles.root__input}
                    type="file"
                    onChange={this.handleUpload}
                    onClick={e => {
                      e.stopPropagation();
                      (e.target as HTMLInputElement).value = '';
                    }}
                  />
                </label>
              </button>
              <button
                disabled={!this.state.base64 || this.state.base64.length === 0}
                onClick={e => {
                  e.preventDefault();
                  this.reportChange('');
                }}
              >
                {this.TEXT_CONTENT.btnClear}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  private handleUpload = (e: React.ChangeEvent) => {
    const file = (e.target as HTMLInputElement).files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // reader.result is base64 string but for whole img with big size!
          // so just render it on hidden canvas, after that this canvas return
          // base64 for cutted image that will be smaller in bytes!
          ImgUploader.getBase64FromUrl(reader.result).then(base64 => {
            this.reportChange(base64 || '');
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  private reportChange = (base64: string): void => {
    const event = {
      target: {},
    };
    (event.target as Record<string, unknown>).value = base64;

    this.props.onChange?.(event as unknown as React.ChangeEvent);
  };

  static getBase64FromUrl(url: string): Promise<string | undefined> {
    const div = document.createElement('div');
    return new Promise<string | undefined>(res => {
      const loader = React.createRef<ImgLoader<ImgLoaderProps>>();
      ReactDOM.render(
        ReactDOM.createPortal(<ImgLoader ref={loader} />, div),
        div,
      );
      setTimeout(() => {
        if (loader.current) {
          loader.current
            .loadNewImg(url)
            .then(() => {
              if (!loader.current) res(undefined);
              else
                loader.current
                  .getBase64()
                  .then(base64 => res(base64))
                  .catch(() => res(undefined));
            })
            .catch(() => res(undefined));
        }
      });
    }).finally(() => div.remove());
  }
}
