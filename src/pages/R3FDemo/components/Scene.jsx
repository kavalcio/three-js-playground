import { extend, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { CustomObject } from '.';

extend({ OrbitControls });

export const Scene = () => {
  const groupRef = useRef();
  const cubeRef = useRef();

  const { camera, gl } = useThree();

  useFrame((state, delta) => {
    cubeRef.current.rotation.x += delta;
    cubeRef.current.rotation.y += delta;

    groupRef.current.rotation.y += delta / 2;
  });

  return (
    <>
      <orbitControls args={[camera, gl.domElement]} />

      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight color={0xffffff} intensity={1} position={[3, 3, 3]} />

      <group ref={groupRef}>
        <mesh ref={cubeRef} position={[1, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh position={[-1, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial />
        </mesh>
      </group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color={0xbbbbff} side={THREE.DoubleSide} />
      </mesh>
      <CustomObject />
    </>
  );
};
