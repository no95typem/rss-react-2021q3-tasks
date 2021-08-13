import * as React from 'react';

import { Canvas } from '@react-three/fiber';
import {
  GizmoHelper,
  GizmoViewport,
  Html,
  Loader,
  MapControls,
  OrbitControls,
  PointerLockControls,
  Stats,
  TrackballControls,
  TransformControls,
} from '@react-three/drei';

import Tiger from '../tiger/Scene';

import styles from './threejs-test.scss';
import { Object3D } from 'three';

// const Model = () => {
//   const gltf = useGLTF('./RobotExpressive.glb');
//   return <primitive object={gltf.scene}></primitive>;
// };

export const ThreejsTestPage: React.FC = () => {
  const ref = React.useRef<Object3D>();

  return (
    <section>
      <h3>threejs playground</h3>
      <Canvas
        className={styles.root__window}
        style={{ height: '500px' }}
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 100], fov: 70 }}
        onCreated={({ gl, camera }) => {
          // if (ref.current) {
          //   const pos = camera?.getWorldPosition(ref.current);
            camera.lookAt(0, 0, 0);
          // }
        }}
      >
        <ambientLight />
        <Stats showPanel={1}></Stats>

        <React.Suspense
          fallback={
            <Html center>
              <Loader />
            </Html>
          }
        >
          <OrbitControls />
          <TransformControls>
            <Tiger ref={ref}></Tiger>
          </TransformControls>

          {/* <Model></Model> */}
        </React.Suspense>
      </Canvas>
    </section>
  );
};
