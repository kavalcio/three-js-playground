import { useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, Stats } from '@react-three/drei';
import { InstancedRigidBodies, Physics, RigidBody } from '@react-three/rapier';
import { useEffect, useMemo, useRef } from 'react';

const COUNT = 50;

export const Scene = () => {
  const rigidBodies = useRef();

  useEffect(() => {
    if (!rigidBodies.current) {
      return;
    }

    // // You can access individual instanced by their index
    // rigidBodies.current[40].applyImpulse({ x: 0, y: 10, z: 0 }, true);
    // rigidBodies.current.at(100).applyImpulse({ x: 0, y: 10, z: 0 }, true);

    // Or update all instances
    rigidBodies.current.forEach((api) => {
      api.applyImpulse({ x: 0, y: 10, z: 0 }, true);
    });
  }, []);

  useFrame((state, delta) => {});

  const instances = useMemo(() => {
    const instances = [];

    for (let i = 0; i < COUNT; i++) {
      instances.push({
        key: 'instance_' + Math.random(),
        position: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
        rotation: [Math.random(), Math.random(), Math.random()],
      });
    }

    return instances;
  }, []);

  return (
    <>
      <Stats />
      <OrbitControls dampingFactor={0.18} makeDefault />
      <Environment background preset="sunset" />

      <Physics debug>
        <RigidBody colliders="hull">
          <mesh position={[0, 2, 0]} rotation-x={0.2}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>

        <RigidBody type="fixed">
          <mesh position={[0, -1.5, 0]}>
            <boxGeometry args={[30, 0.2, 30]} />
            <meshStandardMaterial />
          </mesh>
        </RigidBody>

        <InstancedRigidBodies
          ref={rigidBodies}
          instances={instances}
          colliders="hull"
        >
          <instancedMesh args={[undefined, undefined, COUNT]} count={COUNT}>
            <boxGeometry args={[0.5, 0.5, 0.5]} />
            <meshStandardMaterial />
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
};
