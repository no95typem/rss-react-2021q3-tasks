import * as React from 'react';

import styles from './img-loader.scss';

const defaultAvatarSvg = require('./default.svg');

interface HTMLCanvasElementWithValue extends HTMLCanvasElement {
  value?: string;
}

export interface ImgLoaderProps {
  onChange?: (e: React.ChangeEvent) => void;
  base64?: string;
  className?: string;
  canvasW?: number;
  canvasH?: number;
}

export interface ImgLoaderState {
  canvasW: number;
  canvasH: number;
  base64?: string;
  defaultImg: HTMLImageElement | undefined;
}

export class ImgLoader<T extends ImgLoaderProps> extends React.Component<T> {
  static readonly DEFAULTS = {
    canvasW: 200,
    canvasH: 200,
  };

  state: ImgLoaderState = {
    canvasW: this.props.canvasW ?? ImgLoader.DEFAULTS.canvasW,
    canvasH: this.props.canvasH ?? ImgLoader.DEFAULTS.canvasH,
    defaultImg: undefined,
  };

  protected canvasRef = React.createRef<HTMLCanvasElement>();

  componentDidUpdate(): void {
    if (typeof this.props.base64 === 'string' && this.props.base64.length > 0)
      this.loadNewImg(this.props.base64);
    else this.clearImg();
  }

  shouldComponentUpdate(
    nextProps: ImgLoaderProps,
    nextState: ImgLoaderState,
  ): boolean {
    const should =
      this.state.base64?.slice(0, 40) !== nextProps.base64?.slice(0, 40);
    // eslint-disable-next-line react/no-direct-mutation-state
    if (should) this.state.base64 = nextProps.base64;
    return should;
  }

  render(): JSX.Element {
    return (
      <canvas
        className={this.props.className ?? styles.root}
        ref={this.canvasRef}
      ></canvas>
    );
  }

  componentDidMount(): void {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    canvas.width = this.state.canvasW;
    canvas.height = this.state.canvasH;
    canvas.style.setProperty('background-color', '#FFFFFFD0');

    if (typeof this.props.base64 === 'string')
      this.loadNewImg(this.props.base64);
    else this.drawDefaultImg();
  }

  private loadDefaultImg() {
    return new Promise(res => {
      const img = new Image();
      img.width = this.state.canvasW;
      img.height = this.state.canvasH;
      img.src = defaultAvatarSvg.default;
      img.onload = () => {
        this.setState({ defaultImg: img });
        res(true);
      };
      img.onerror = () => {
        res(false);
      };
    });
  }

  private calcDrawParams = (
    img: HTMLImageElement,
  ): [number, number, number, number] => {
    let sx: number;
    let sy: number;
    let sWidth: number;
    let sHeight: number;

    const ratio = img.width / img.height;

    if (ratio >= 1) {
      sWidth = img.height;
      sHeight = img.height;
      sx = (img.width - sWidth) / 2;
      sy = 0;
    } else {
      sWidth = img.width;
      sHeight = img.width;
      sx = 0;
      sy = (img.height - sHeight) / 2;
    }

    return [sx, sy, sWidth, sHeight];
  };

  public loadNewImg(src: string): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = this.canvasRef.current as HTMLCanvasElement;
        canvas.width = this.state.canvasW;
        canvas.height = this.state.canvasH;

        const [sx, sy, sWidth, sHeight] = this.calcDrawParams(img);

        this.clearImg().then(() => {
          canvas
            .getContext('2d')
            ?.drawImage(
              img,
              sx,
              sy,
              sWidth,
              sHeight,
              0,
              0,
              this.state.canvasW,
              this.state.canvasH,
            );

          res(true);
        });
      };
      img.onerror = () => {
        rej(new Error(`can't load img`));
      };
    });
  }

  getBase64(): Promise<string | undefined> {
    return new Promise(res => {
      this.getBlobPromise().then(blob => {
        if (!blob) res(undefined);
        else {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result as string);
          reader.onerror = () => res(undefined);
          reader.onabort = () => res(undefined);
          reader.readAsDataURL(blob);
        }
      });
    });
  }

  getBlobPromise(): Promise<Blob | null> {
    return new Promise(res => {
      const canvas = this.canvasRef.current as HTMLCanvasElement;
      canvas.toBlob(res);
    });
  }

  clearImg(): Promise<void> {
    const canvas = this.canvasRef.current as HTMLCanvasElement;
    canvas
      .getContext('2d')
      ?.clearRect(0, 0, this.state.canvasW, this.state.canvasH);
    // this.handleChange();
    return this.drawDefaultImg();
  }

  drawDefaultImg(): Promise<void> {
    return new Promise(res => {
      const action = () => {
        if (this.state.defaultImg) {
          const canvas = this.canvasRef.current as HTMLCanvasElement;
          canvas
            .getContext('2d')
            ?.drawImage(
              this.state.defaultImg,
              0,
              0,
              this.state.canvasW,
              this.state.canvasH,
            );
          res();
        }
      };
      if (!this.state.defaultImg) this.loadDefaultImg().then(() => action());
      else action();
    });
  }
}
