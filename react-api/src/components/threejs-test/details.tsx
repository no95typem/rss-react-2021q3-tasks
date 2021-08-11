import * as React from 'react';

import { Canvas } from '@react-three/fiber';
import { Html, Loader } from '@react-three/drei';

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
        gl={{ alpha: true }}
        camera={{ position: [0, 15, 30], fov: 15 }}
        onCreated={({ gl, camera }) => {
          camera.lookAt(0, 0, 0);
        }}
      >
        <ambientLight />
        <React.Suspense
          fallback={
            <Html center>
              <Loader />
            </Html>
          }
        >
          {/* <Model></Model> */}
          <Tiger></Tiger>
        </React.Suspense>
      </Canvas>
    </section>
  );
};
