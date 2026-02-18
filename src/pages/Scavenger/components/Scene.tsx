import { OrbitControls, Stats, useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

import { CharacterController } from './CharacterController';
import { Environment } from './Environment';

// TODO: add r3f-perf
// TODO: try tweakpane. it doesn't work with react out of the box, but it's possible to make it work
export const Scene = () => {
  const groupRef = useRef<THREE.Group | null>(null);
  const cubeRef = useRef<THREE.Mesh | null>(null);
  const sphereRef = useRef<THREE.Mesh | null>(null);

  const [{ color1, color2, planeCoords }, set] = useControls(() => ({
    color1: { value: '#ffffff', label: 'Cube color' },
    color2: { value: '#ff0000', label: 'Sphere color' },
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
          <meshStandardMaterial color={color1} />
        </mesh>
        <mesh ref={sphereRef} position={[-1, 0, 0]} castShadow>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color={color2} />
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
        <meshStandardMaterial color={0x99dd44} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
