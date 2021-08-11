/* eslint-disable no-underscore-dangle */
/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
author: AVINAS (https://sketchfab.com/AVINAS)
license: CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
source: https://sketchfab.com/3d-models/tiger-rigged-with-many-different-animations-57cf4929902f4fa8b55503069065df7c
title: Tiger rigged with many different animations
*/

import * as THREE from 'three';
import * as React from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import { useEffect } from 'react';

interface GLTFAction extends THREE.AnimationClip {
  name: ActionName;
}

type GLTFResult = GLTF & {
  nodes: {
    Object_57: THREE.SkinnedMesh;
    _rootJoint: THREE.Bone;
  };
  materials: {
    Tiger_Default: THREE.MeshStandardMaterial;
  };
  animations: GLTFAction[];
};

type ActionName =
  | 'Attack'
  | 'Eat'
  | 'Howl'
  | 'Idle_Lie Prone'
  | 'Run'
  | 'Walk'
  | 'Walk Fast';
// type GLTFActions = Record<ActionName, THREE.AnimationAction>;

export default function Tiger(props: JSX.IntrinsicElements['group']) {
  const group = React.useRef<THREE.Group>();
  const { nodes, materials, animations } = useGLTF('/scene.gltf') as GLTFResult;
  const { actions } = useAnimations(animations, group);
  useEffect(() => {
    actions['Idle_Lie Prone']?.play();
  }, []);
  return (
    <group ref={group} {...props} dispose={null} renderOrder={2}>
      <group
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, Math.PI, 0]}
        scale={0.1}
      >
        <group rotation={[0, 0, 0]}>
          <group name="Bip01" position={[0, 4.87, 35.66]} rotation={[0, 0, 0]}>
            <primitive object={nodes._rootJoint} />
            <skinnedMesh
              geometry={nodes.Object_57.geometry}
              material={materials.Tiger_Default}
              skeleton={nodes.Object_57.skeleton}
            />
          </group>
        </group>
      </group>
    </group>
  );
}

useGLTF.preload('/scene.gltf');
