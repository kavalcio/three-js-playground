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

const rayOrigin = new THREE.Vector3();

export const Scene = () => {
  const rigidBodies = useRef();
  const instancedMeshes = useRef();
  const arrowHelper = useRef();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

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

  console.log({ rigidBodies, instancedMeshes });

  useFrame(() => {
    if (!instancedMeshes.current) return;
    // Point ray at first element in the instanced mesh
    const newmatrix = new THREE.Matrix4();
    instancedMeshes.current.getMatrixAt(0, newmatrix);
    rayOrigin.setFromMatrixPosition(newmatrix);
    rayOrigin.y -= 2;
    raycaster.set(rayOrigin, new THREE.Vector3(0, 1, 0));
    arrowHelper.current.position.copy(raycaster.ray.origin);
    arrowHelper.current.setDirection(raycaster.ray.direction);

    // TODO: do we need to do this per frame? or do we just need to do it on dice generation?
    instancedMeshes.current.computeBoundingSphere();

    const intersection = raycaster.intersectObjects([instancedMeshes.current]);

    if (intersection.length > 0) {
      // console.log(intersection[0].faceIndex);
    }
  });

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
        <InstancedRigidBodies instances={d6Instances} colliders="hull">
          <instancedMesh
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
          ref={rigidBodies}
          instances={d20Instances}
          colliders="hull"
        >
          <instancedMesh
            ref={instancedMeshes}
            args={[undefined, undefined, MAX_COUNT]}
            count={d20Instances.length}
            frustumCulled={false}
            onClick={(e) => {
              console.log('click d20', e.intersections[0].faceIndex);
              rigidBodies.current[e.intersections[0].instanceId].applyImpulse(
                { x: 0, y: 10, z: 0 },
                true,
              );
              rigidBodies.current[
                e.intersections[0].instanceId
              ].applyTorqueImpulse({ x: 2, y: 2, z: 2 }, true);
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
