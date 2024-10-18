import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, Stats, TransformControls } from '@react-three/drei';
import { useControls } from 'leva';

import { CustomObject } from '.';

// TODO: add r3f-perf
// TODO: try tweakpane. it doesn't work with react out of the box, but it's possible to make it work
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

  const { color1, color2, planeCoords, showTransformControls } = useControls({
    color1: { value: '#ffffff', label: 'Cube color' },
    color2: { value: '#ff0000', label: 'Sphere color' },
    planeCoords: { value: { x: 0, z: 0 }, step: 0.1, label: 'Plane coords' },
    showTransformControls: { value: true, label: 'Show transform controls' },
  });

  return (
    <>
      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault />

      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight color={0xffffff} intensity={1} position={[3, 3, 3]} />

      {showTransformControls && (
        <>
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
        </>
      )}
      <group ref={groupRef}>
        <mesh ref={cubeRef} position={[2, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
          <boxGeometry />
          <meshStandardMaterial color={color1} />
        </mesh>
        <mesh ref={sphereRef} position={[-2, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color={color2} />
        </mesh>
      </group>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        position-x={planeCoords.x}
        position-y={-2}
        position-z={planeCoords.z}
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color={0xbbbbff} side={THREE.DoubleSide} />
      </mesh>
      <CustomObject />
    </>
  );
};
