import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, TransformControls } from '@react-three/drei';

import { CustomObject } from '.';

export const Scene = () => {
  const groupRef = useRef();
  const cubeRef = useRef();
  const sphereRef = useRef();

  const [rotate, setRotate] = useState(true);

  useFrame((state, delta) => {
    if (!rotate) return;
    cubeRef.current.rotation.x += delta;
    cubeRef.current.rotation.y += delta;

    groupRef.current.rotation.y += delta / 2;
  });

  return (
    <>
      <OrbitControls dampingFactor={0.18} makeDefault />

      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight color={0xffffff} intensity={1} position={[3, 3, 3]} />

      <TransformControls
        object={cubeRef}
        onMouseDown={() => setRotate(false)}
        onMouseUp={() => setRotate(true)}
      />

      <TransformControls
        object={sphereRef}
        onMouseDown={() => setRotate(false)}
        onMouseUp={() => setRotate(true)}
      />

      <group ref={groupRef}>
        <mesh ref={cubeRef} position={[2, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
        <mesh ref={sphereRef} position={[-2, 0, 0]}>
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
