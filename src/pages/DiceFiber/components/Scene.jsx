import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Stats } from '@react-three/drei';
import { InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier';
import { useEffect, useMemo, useRef, useState } from 'react';
import { button, useControls } from 'leva';

const COUNT = 10;
const MAX_COUNT = 200;

const generateRandomDiceInstances = (count) => {
  const instances = [];

  for (let i = 0; i < count; i++) {
    instances.push({
      key: 'instance_' + Math.random(),
      position: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
      rotation: [Math.random(), Math.random(), Math.random()],
    });
  }

  return instances;
};

// TODO: frustum culling causes instances to disappear at certain camera positions and angles, fix it
export const Scene = () => {
  const rigidBodies = useRef();

  const [d6Instances, setD6Instances] = useState([]);
  const [d20Instances, setD20Instances] = useState([]);

  // const { d6Count, d20Count } = useControls({
  //   d6Count: { value: COUNT, min: 1, max: 100, step: 1 },
  //   d20Count: { value: COUNT, min: 1, max: 100, step: 1 },
  //   // test: { value: () => console.log('test') },
  // });

  const createDiceInstances = ({ d6Count, d20Count }) => {
    setD6Instances(generateRandomDiceInstances(d6Count));
    setD20Instances(generateRandomDiceInstances(d20Count));
  };

  useControls({
    d6Count: { value: COUNT, min: 1, max: 100, step: 1 },
    d20Count: { value: COUNT, min: 1, max: 100, step: 1 },
    generateDice: button((get) =>
      createDiceInstances({
        d6Count: get('d6Count'),
        d20Count: get('d20Count'),
      }),
    ),
  });

  return (
    <>
      <Stats />
      {/* <OrbitControls dampingFactor={0.18} makeDefault /> */}
      <OrbitControls enableDamping={false} makeDefault />
      <Environment background preset="sunset" />

      <Physics debug>
        {/* Ground */}
        <RigidBody type="fixed">
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[30, 0.2, 30]} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>

        {/* d6 Instances */}
        <InstancedRigidBodies
          ref={rigidBodies}
          instances={d6Instances}
          colliders="hull"
        >
          <instancedMesh
            args={[undefined, undefined, MAX_COUNT]}
            count={d6Instances.length}
            frustumCulled={false}
          >
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial />
          </instancedMesh>
        </InstancedRigidBodies>

        {/* d20 Instances */}
        <InstancedRigidBodies instances={d20Instances} colliders="hull">
          <instancedMesh
            args={[undefined, undefined, MAX_COUNT]}
            count={d20Instances.length}
            frustumCulled={false}
          >
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
};
