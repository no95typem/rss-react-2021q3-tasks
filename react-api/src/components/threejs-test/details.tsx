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

// const Model = () => {
//   const gltf = useGLTF('./RobotExpressive.glb');
//   return <primitive object={gltf.scene}></primitive>;
// };

export const ThreejsTestPage: React.FC = () => {
  return (
    <section>
      <h3>threejs playground</h3>
      <Canvas
        style={{ height: '500px' }}
        gl={{ alpha: true }}
        camera={{ position: [0, 0, 100], fov: 70 }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0);
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
            <Tiger></Tiger>
          </TransformControls>

          {/* <Model></Model> */}
        </React.Suspense>
      </Canvas>
    </section>
  );
};
