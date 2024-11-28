import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

import { DiceRigidBodies, Stage } from './';

import {
  INITIAL_DIE_COUNT,
  MAX_DIE_COUNT,
  DIE_SCALE,
  DIE_SPAWN_AREA_WIDTH,
} from '../constants';

const DIE_TYPES = {
  d4: {
    geometry: <tetrahedronGeometry args={[DIE_SCALE]} />,
  },
  d6: {
    geometry: <boxGeometry args={[DIE_SCALE, DIE_SCALE, DIE_SCALE]} />,
  },
  d20: {
    geometry: <icosahedronGeometry args={[DIE_SCALE, 0]} />,
  },
};

const generateRandomDiceInstances = (count) => {
  const instances = [];

  for (let i = 0; i < count; i++) {
    instances.push({
      key: 'instance_' + Math.random(),
      position: [
        (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
        5 + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
    });
  }

  return instances;
};

const tempVector = new THREE.Vector3();
const tempMatrix = new THREE.Matrix4();
const upVector = new THREE.Vector3(0, 1, 0);

/*
- TODO: prevent total die count from exceeding X
- TODO: add all dice types
- TODO: stash debug mode on url hash, pick it up on page load
- TODO: create mapping of face index to roll result for each die type
- TODO: fine tune sleep thresholds
- TODO: do an animation (maybe bounce the result text) when roll is finished (i.e. all dice are sleeping)
- TODO: add restitution, friction values to rigid bodies
- TODO: add audio on collision
- TODO: add some ambience, music, props, lighting, env map of a tavern
- TODO: raycasting is a huge hit to performance. test if the face normals method from the old dice project is faster
*/
export const Scene = ({ diceRollSum, setDiceRollSum }) => {
  const rb_d4 = useRef(); // d4 rigid bodies
  const rb_d6 = useRef(); // d6 rigid bodies
  const rb_d20 = useRef(); // d20 rigid bodies
  const im_d4 = useRef(); // d4 instanced mesh
  const im_d6 = useRef(); // d6 instanced mesh
  const im_d20 = useRef(); // d20 instanced mesh

  const instanceRefs = {
    d4: { rb: rb_d4, im: im_d4 },
    d6: { rb: rb_d6, im: im_d6 },
    d20: { rb: rb_d20, im: im_d20 },
  };

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const [diceCounts, setDiceCounts] = useState(() =>
    Object.keys(DIE_TYPES).reduce((acc, key) => {
      acc[key] = INITIAL_DIE_COUNT;
      return acc;
    }, {}),
  );

  const { debug } = useControls({
    ...Object.keys(DIE_TYPES).reduce((acc, key) => {
      acc[key] = {
        label: key + ' Count',
        value: INITIAL_DIE_COUNT,
        min: 0,
        max: MAX_DIE_COUNT,
        step: 1,
      };
      return acc;
    }, {}),
    Roll: button((get) =>
      setDiceCounts(
        Object.keys(DIE_TYPES).reduce((acc, key) => {
          acc[key] = get(key);
          return acc;
        }, {}),
      ),
    ),
    debug: {
      label: 'debug mode',
      value: false,
    },
  });

  // TODO: this runs 3 times on initial render, why?
  const diceInstances = useMemo(
    () =>
      Object.keys(DIE_TYPES).reduce((acc, key) => {
        acc[key] = generateRandomDiceInstances(diceCounts[key]);
        return acc;
      }, {}),
    [diceCounts],
  );

  useFrame(() => {
    let faceIndexSum = 0;

    Object.keys(DIE_TYPES).forEach((key) => {
      const instancedMesh = instanceRefs[key].im;
      const instances = diceInstances[key];

      if (!instancedMesh.current) return;

      instances.forEach((instance, index) => {
        instancedMesh.current.getMatrixAt(index, tempMatrix);
        tempVector.setFromMatrixPosition(tempMatrix);
        tempVector.y -= 2;
        raycaster.set(tempVector, upVector);
        // arrowHelper.current.position.copy(raycaster.ray.origin);
        // arrowHelper.current.setDirection(raycaster.ray.direction);
        instancedMesh.current.computeBoundingSphere();

        const intersections = raycaster.intersectObject(instancedMesh.current);

        if (intersections.length > 0) {
          faceIndexSum += intersections[0].faceIndex;
        }
      });
    });

    if (diceRollSum !== faceIndexSum) setDiceRollSum(faceIndexSum);
  });

  return (
    <>
      {debug && <Perf position="top-left" />}
      <OrbitControls
        // dampingFactor={0.18}
        enableDamping={false}
        makeDefault
      />
      <Environment preset="sunset" />
      <Physics debug={debug}>
        <Stage />
        {Object.keys(DIE_TYPES).map((key) => (
          <DiceRigidBodies
            key={key}
            rigidBodyRef={instanceRefs[key].rb}
            instancedMeshRef={instanceRefs[key].im}
            diceInstances={diceInstances[key]}
            geometry={DIE_TYPES[key].geometry}
          />
        ))}
      </Physics>
    </>
  );
};
