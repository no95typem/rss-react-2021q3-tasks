import * as React from 'react';

import styles from './about.scss';

export const About: React.FC = () => {
  // const videoRef = React.useRef<HTMLVideoElement>(null!);

  // const mediaStreamConstrains: MediaStreamConstraints = {
  //   video: true,
  // };

  // navigator.mediaDevices.getUserMedia(mediaStreamConstrains);

  return (
    <section className={styles.root}>
      <h2>About</h2>
      <article className={styles.root__article}>
        <p>
          This is my small project for Rolling Scopes School: React 2021 Q3.
        </p>
        <section>
          <p>In the project I learned React basics:</p>
          <ul>
            <li>React components (FC and CC)</li>
            <li>React state, hooks, lifecycle, a data flow pattern</li>
            <li>React router</li>
            <li>React transition group</li>
            <li>React + Redux + thunk</li>
            <li>React + Jest + React testing library</li>
          </ul>
        </section>
        <section>
          <p>
            The project uses <a href="https://wallhaven.cc">Wallhaven</a> API.
            It is tricky because server responses do not have some essential
            headers. Therefore app need a cors proxy server.
          </p>
        </section>
        <section>
          <p>The project written and builded with usage of:</p>
          <ul>
            <li>React</li>
            <li>Redux + thunk</li>
            <li>Bootstrap CSS and icons</li>
            <li>Typescript</li>
            <li>Webpack 5</li>
          </ul>
        </section>
        <p>You can find more at my github repo.</p>
      </article>
      {/* <video ref={videoRef} autoPlay></video> */}
    </section>
  );
};
