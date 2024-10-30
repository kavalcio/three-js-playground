import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Stats } from '@react-three/drei';
import { InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import { button, useControls } from 'leva';
import * as THREE from 'three';

const COUNT = 3;
const MAX_COUNT = 100;
const FIELD_SIZE = 10;

const generateRandomDiceInstances = (count) => {
  const instances = [];

  for (let i = 0; i < count; i++) {
    instances.push({
      key: 'instance_' + Math.random(),
      position: [
        (Math.random() - 0.5) * FIELD_SIZE,
        5 + (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * FIELD_SIZE,
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
    });
  }

  return instances;
};

const tempVector = new THREE.Vector3();
const tempMatrix = new THREE.Matrix4();
const upVector = new THREE.Vector3(0, 1, 0);

// TODO: sleep rigid bodies when they stop moving. wake them up when they're clicked
export const Scene = () => {
  const rb_d6 = useRef(); // d6 rigid bodies
  const rb_d20 = useRef(); // d20 rigid bodies
  const im_d6 = useRef(); // d6 instanced mesh
  const im_d20 = useRef(); // d20 instanced mesh

  const arrowHelper = useRef();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  const [diceRollSum, setDiceRollSum] = useState(0);
  const [d6Instances, setD6Instances] = useState([]);
  const [d20Instances, setD20Instances] = useState([]);

  const createDiceInstances = ({ d6Count, d20Count }) => {
    setD6Instances(generateRandomDiceInstances(d6Count));
    setD20Instances(generateRandomDiceInstances(d20Count));
  };

  useControls({
    d6Count: {
      label: 'd6 Count',
      value: COUNT,
      min: 0,
      max: MAX_COUNT,
      step: 1,
    },
    d20Count: {
      label: 'd20 Count',
      value: COUNT,
      min: 0,
      max: MAX_COUNT,
      step: 1,
    },
    generateDice: button((get) =>
      createDiceInstances({
        d6Count: get('d6Count'),
        d20Count: get('d20Count'),
      }),
    ),
  });

  // console.log({ im_d6, im_d20 });

  useFrame(() => {
    let faceIndexSum = 0;

    [
      { rigidBody: rb_d6, instancedMesh: im_d6, instances: d6Instances },
      { rigidBody: rb_d20, instancedMesh: im_d20, instances: d20Instances },
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

  console.log(diceRollSum);

  return (
    <>
      <Stats />
      {/* <OrbitControls dampingFactor={0.18} makeDefault /> */}
      <OrbitControls enableDamping={false} makeDefault />
      <Environment background preset="sunset" />

      <Physics
      // debug
      >
        {/* Ground */}
        <RigidBody type="fixed">
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[30, 0.2, 30]} />
            <meshStandardMaterial wireframe />
          </mesh>
        </RigidBody>

        {/* d6 Instances */}
        <InstancedRigidBodies
          ref={rb_d6}
          instances={d6Instances}
          colliders="hull"
        >
          <instancedMesh
            ref={im_d6}
            args={[undefined, undefined, MAX_COUNT]}
            count={d6Instances.length}
            frustumCulled={false}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial wireframe />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* d20 Instances */}
        <InstancedRigidBodies
          ref={rb_d20}
          instances={d20Instances}
          colliders="hull"
        >
          <instancedMesh
            ref={im_d20}
            args={[undefined, undefined, MAX_COUNT]}
            count={d20Instances.length}
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
            <meshStandardMaterial wireframe />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* TODO: convert arrowhelper into an instanced mesh */}
        <arrowHelper
          ref={arrowHelper}
          args={[
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(0, 0, 0),
            2,
            0xff0000,
          ]}
        />
      </Physics>
    </>
  );
};