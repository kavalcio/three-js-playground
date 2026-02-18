import { OrbitControls, Stats } from '@react-three/drei';
import { useControls } from 'leva';
import { useRef } from 'react';
import * as THREE from 'three';

import { CharacterController } from './CharacterController';
import { Environment } from './Environment';

export const Scene = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  const [{ planeCoords }, set] = useControls(() => ({
    planeCoords: { value: { x: 0, z: 0 }, step: 0.1, label: 'Plane coords' },
  }));

  return (
    <>
      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault enablePan={false} />

      <Environment />

      <CharacterController />

      <group ref={groupRef}>
        <mesh
          ref={cubeRef}
          position={[1, 0, 0]}
          rotation={[0, Math.PI / 3, 0]}
          castShadow
        >
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh ref={sphereRef} position={[-1, 0, 0]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial />
        </mesh>
      </group>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position-x={planeCoords.x}
        position-y={-1}
        position-z={planeCoords.z}
        receiveShadow
      >
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
