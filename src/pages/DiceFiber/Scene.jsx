import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { createRef, useMemo, useState } from 'react';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

import { DiceRigidBodies, Stage } from './components';
import { INITIAL_DIE_COUNT, MAX_DIE_COUNT, DIE_SCALE } from './constants';
import { generateRandomDiceInstances } from './utils';

// TODO: add unique models for each die type
const DIE_TYPES = {
  d4: {
    geometry: <tetrahedronGeometry args={[DIE_SCALE]} />,
  },
  d6: {
    geometry: <boxGeometry args={[DIE_SCALE, DIE_SCALE, DIE_SCALE]} />,
    modelPath: 'models/d6/d6.gltf',
  },
  d8: {
    geometry: <octahedronGeometry args={[DIE_SCALE, 0]} />,
  },
  // d10: {
  // Add a pentagonal trapezohedron
  // geometry: <dodecahedronGeometry args={[DIE_SCALE, 1]} />,
  // },
  d12: {
    geometry: <dodecahedronGeometry args={[DIE_SCALE, 0]} />,
  },
  d20: {
    geometry: <icosahedronGeometry args={[DIE_SCALE, 0]} />,
  },
};

const tempVector = new THREE.Vector3();
const tempMatrix = new THREE.Matrix4();
const upVector = new THREE.Vector3(0, 1, 0);

/*
Notes:
- the DnD Beyond digital dice roller is a good example for this

TODOs:
- TODO: update UI: Instead of sliders, add a button for each die (with the icon as the die image).
  Left clicking button increments count, right clicking decrements count. Show current count on button.
- TODO: all useMemos run 3 times on load, why?
- TODO: add d10 (pentagonal trapezohedron)
- TODO: prevent total die count from exceeding X
- TODO: stash debug mode on url hash, pick it up on page load
- TODO: create mapping of face index to roll result for each die type
- TODO: fine tune sleep thresholds
- TODO: do an animation (maybe bounce the result text) when roll is finished (i.e. all dice are sleeping)
- TODO: add restitution, friction values to rigid bodies
- TODO: add audio on collision
- TODO: add some ambience, music, props, lighting, env map of a tavern
- TODO: raycasting is a huge hit to performance. test if the face normals method from the old dice project is faster
- TODO: make all die move in generally the same direction, like they were all thrown at once
- TODO: view a history of rolls
- TODO: make physics a bit faster
*/
export const Scene = ({ diceRollSum, setDiceRollSum }) => {
  const instanceRefs = useMemo(
    () =>
      Object.keys(DIE_TYPES).reduce((acc, key) => {
        acc[key] = {
          rb: createRef(), // rigid bodies ref
          im: createRef(), // instanced mesh ref
        };
        return acc;
      }, {}),
    [],
  );

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

  const diceInstances = useMemo(
    () =>
      Object.keys(DIE_TYPES).reduce((acc, key) => {
        acc[key] = generateRandomDiceInstances(diceCounts[key]);
        return acc;
      }, {}),
    [diceCounts],
  );

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

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
            modelPath={DIE_TYPES[key].modelPath}
            debug={debug}
          />
        ))}
      </Physics>
    </>
  );
};
