import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import {
  CuboidCollider,
  InstancedRigidBodies,
  Physics,
  RigidBody,
} from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import { button, useControls } from 'leva';
import * as THREE from 'three';
import { Perf } from 'r3f-perf';

const INITIAL_DIE_COUNT = 3;
const MAX_DIE_COUNT = 30;
const DIE_SPAWN_AREA_WIDTH = 15;
const STAGE_WIDTH = 20;

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
- TODO: stash debug mode on url hash, pick it up on page load
- TODO: create mapping of face index to roll result for each die type
- TODO: sleep rigid bodies when they stop moving. wake them up when they're clicked
- TODO: add restitution, friction values to rigid bodies
- TODO: add audio on collision
- TODO: add some ambience, music, props, lighting, env map of a tavern
- TODO: prevent die from falling off stage
- TODO: put die roll result on screen
- TODO: raycasting is a huge hit to performance. test if the face normals method from the old dice project is faster
*/
export const Scene = ({ diceRollSum, setDiceRollSum }) => {
  const rb_d6 = useRef(); // d6 rigid bodies
  const rb_d20 = useRef(); // d20 rigid bodies
  const im_d6 = useRef(); // d6 instanced mesh
  const im_d20 = useRef(); // d20 instanced mesh

  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const [diceCounts, setDiceCounts] = useState({
    d6: INITIAL_DIE_COUNT,
    d20: INITIAL_DIE_COUNT,
  });

  const { debug } = useControls({
    d6Count: {
      label: 'd6 Count',
      value: INITIAL_DIE_COUNT,
      min: 0,
      max: MAX_DIE_COUNT,
      step: 1,
    },
    d20Count: {
      label: 'd20 Count',
      value: INITIAL_DIE_COUNT,
      min: 0,
      max: MAX_DIE_COUNT,
      step: 1,
    },
    Roll: button((get) =>
      setDiceCounts({
        d6: get('d6Count'),
        d20: get('d20Count'),
      }),
    ),
    debug: {
      label: 'debug mode',
      value: false,
    },
  });

  // TODO: this runs 3 times on initial render, why?
  const diceInstances = useMemo(
    () => ({
      d6: generateRandomDiceInstances(diceCounts.d6),
      d20: generateRandomDiceInstances(diceCounts.d20),
    }),
    [diceCounts],
  );

  useFrame(() => {
    let faceIndexSum = 0;

    [
      { rigidBody: rb_d6, instancedMesh: im_d6, instances: diceInstances.d6 },
      {
        rigidBody: rb_d20,
        instancedMesh: im_d20,
        instances: diceInstances.d20,
      },
    ].forEach(({ rigidBody, instancedMesh, instances }) => {
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
      {debug && (
        // <Stats />
        <Perf position="top-left" />
      )}
      {/* <OrbitControls dampingFactor={0.18} makeDefault /> */}
      <OrbitControls enableDamping={false} makeDefault />
      <Environment preset="sunset" />

      {/* Ground Mesh */}
      <mesh position={[0, -1.5, 0]}>
        <boxGeometry args={[STAGE_WIDTH, 0.2, STAGE_WIDTH]} />
        <meshStandardMaterial wireframe />
      </mesh>

      <Physics debug={debug}>
        {/* Ground Rigidbody */}
        <RigidBody type="fixed">
          <CuboidCollider
            args={[STAGE_WIDTH / 2, 0.1, STAGE_WIDTH / 2]}
            position={[0, -1.5, 0]}
          />
          <CuboidCollider
            args={[0.1, 15, STAGE_WIDTH / 2]}
            position={[STAGE_WIDTH / 2, 13, 0]}
          />
          <CuboidCollider
            args={[0.1, 15, STAGE_WIDTH / 2]}
            position={[-STAGE_WIDTH / 2, 13, 0]}
          />
          <CuboidCollider
            args={[STAGE_WIDTH / 2, 15, 0.1]}
            position={[0, 13, STAGE_WIDTH / 2]}
          />
          <CuboidCollider
            args={[STAGE_WIDTH / 2, 15, 0.1]}
            position={[0, 13, -STAGE_WIDTH / 2]}
          />
        </RigidBody>

        {/* d6 Instances */}
        <InstancedRigidBodies
          ref={rb_d6}
          instances={diceInstances.d6}
          // TODO: randomize this on every reset, but how? doing random here causes it to update every frame
          // linearVelocity={[
          //   Math.random() - 0.5,
          //   -5 * Math.random(),
          //   Math.random() - 0.5,
          // ]}
          // angularVelocity={[Math.random(), Math.random(), Math.random()]}
          colliders="hull"
        >
          <instancedMesh
            ref={im_d6}
            args={[undefined, undefined, MAX_DIE_COUNT]}
            count={diceInstances.d6.length}
            frustumCulled={false}
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* d20 Instances */}
        <InstancedRigidBodies
          ref={rb_d20}
          instances={diceInstances.d20}
          colliders="hull"
        >
          <instancedMesh
            ref={im_d20}
            args={[undefined, undefined, MAX_DIE_COUNT]}
            count={diceInstances.d20.length}
            frustumCulled={false}
            onClick={(e) => {
              console.log('click d20', e.intersections[0].faceIndex);
              rb_d20.current[e.intersections[0].instanceId].applyImpulse(
                { x: 0, y: 10, z: 0 },
                true,
              );
              rb_d20.current[e.intersections[0].instanceId].applyTorqueImpulse(
                { x: 2, y: 2, z: 2 },
                true,
              );
            }}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* TODO: convert arrowhelper into an instanced mesh */}
        {/* <arrowHelper
          ref={arrowHelper}
          args={[
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            2,
            0xff0000,
          ]}
        /> */}
      </Physics>
    </>
  );
};
