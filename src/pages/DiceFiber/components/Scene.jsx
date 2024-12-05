import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { Perf } from 'r3f-perf';
import { createRef, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as THREE from 'three';

import {
  DICE_FACE_INDEX_TO_RESULT,
  DIE_SPAWN_AREA_WIDTH,
  DIE_TYPES,
  INITIAL_SPEED,
} from '../constants';
import { generateRandomDiceInstances } from '../utils';
import { DiceRigidBodies, Stage } from '.';

const tempVector = new THREE.Vector3();
const tempMatrix = new THREE.Matrix4();
const upVector = new THREE.Vector3(0, 1, 0);

/*
Notes:
- the DnD Beyond digital dice roller is a good example for this

Features:
- TODO: add a loading screen
- TODO: add die icons to buttons instead of text
- TODO: prevent total die count from exceeding X
- TODO: do an animation (maybe bounce the result text) when roll is finished (i.e. all dice are sleeping)
- TODO: add restitution, friction values to rigid bodies
- TODO: add audio on collision
- TODO: add some ambience, music, props, lighting, env map of a tavern
- TODO: view a history of roll results
- TODO: add normal maps to dice to add texture
- TODO: make ui button vertical stack on mobile, also make it collapsible
- TODO: create an easier way to roll a lot of dice. maybe ability to type in the count, or click and drag to increase count?

Issues:
- TODO: all useMemos run 3 times on load, why?
- TODO: raycasting is a huge hit to performance. test if the face normals method from the old dice project is faster
- TODO: implement shadows in a more performant way
*/
export const Scene = ({ diceCounts, diceRollSum, setDiceRollSum }) => {
  const location = useLocation();

  const model = useGLTF('models/dice/dice.gltf');

  const [isDebug, setDebug] = useState(false);

  useEffect(() => {
    if (location.hash === '#debug') setDebug(true);
  }, [location]);

  const instanceRefs = useMemo(
    () =>
      DIE_TYPES.reduce((acc, key) => {
        acc[key] = {
          rb: createRef(), // rigid bodies ref
          im: createRef(), // instanced mesh ref
        };
        return acc;
      }, {}),
    [],
  );

  const diceInstances = useMemo(() => {
    const baseStartingPosition = [
      (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
      6 + (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * DIE_SPAWN_AREA_WIDTH,
    ];
    // Aim starting velocity toward center of spawn area
    const angle =
      Math.atan2(baseStartingPosition[2], baseStartingPosition[0]) + Math.PI;
    const baseLinearVelocity = [
      Math.cos(angle) * INITIAL_SPEED,
      -5,
      Math.sin(angle) * INITIAL_SPEED,
    ];

    return DIE_TYPES.reduce((acc, key) => {
      acc[key] = generateRandomDiceInstances({
        diceCount: diceCounts[key],
        baseLinearVelocity,
        baseStartingPosition,
      });
      return acc;
    }, {});
  }, [diceCounts]);

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  useFrame(() => {
    let faceIndexSum = 0;

    DIE_TYPES.forEach((key) => {
      const instancedMesh = instanceRefs[key].im;
      const instances = diceInstances[key];

      if (!instancedMesh.current) return;

      instances.forEach((instance, index) => {
        instancedMesh.current.getMatrixAt(index, tempMatrix);
        tempVector.setFromMatrixPosition(tempMatrix);
        tempVector.y -= 5;
        raycaster.set(tempVector, upVector);
        instancedMesh.current.computeBoundingSphere();

        const intersections = raycaster.intersectObject(instancedMesh.current);

        if (intersections.length > 0) {
          faceIndexSum +=
            DICE_FACE_INDEX_TO_RESULT[key][intersections[0].faceIndex];
        }
      });
    });

    if (diceRollSum !== faceIndexSum) setDiceRollSum(faceIndexSum);
  });

  return (
    <>
      {isDebug && <Perf position="top-left" />}
      <OrbitControls dampingFactor={0.18} makeDefault />
      <Environment preset="sunset" />
      <Physics debug={isDebug}>
        <Stage />
        {DIE_TYPES.map((key) => (
          <DiceRigidBodies
            key={key}
            dieType={key}
            rigidBodyRef={instanceRefs[key].rb}
            instancedMeshRef={instanceRefs[key].im}
            diceInstances={diceInstances[key]}
            diceModels={model}
            isDebug={isDebug}
          />
        ))}
      </Physics>
    </>
  );
};
