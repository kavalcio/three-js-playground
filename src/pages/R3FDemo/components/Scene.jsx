import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls, Stats, TransformControls } from '@react-three/drei';
import { useControls } from 'leva';
import { useLocation, useNavigate } from 'react-router-dom';

// TODO: add r3f-perf
// TODO: try tweakpane. it doesn't work with react out of the box, but it's possible to make it work
export const Scene = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

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

  const [{ color1, color2, planeCoords, showTransformControls }, set] =
    useControls(() => ({
      color1: { value: '#ffffff', label: 'Cube color' },
      color2: { value: '#ff0000', label: 'Sphere color' },
      planeCoords: { value: { x: 0, z: 0 }, step: 0.1, label: 'Plane coords' },
      showTransformControls: { value: false, label: 'Show transform controls' },
    }));

  useEffect(() => {
    if (initialized) return;
    const hash = location.hash;
    set({ showTransformControls: hash === '#show-transform' });
    setInitialized(true);
  }, [location, initialized, set]);

  useEffect(() => {
    if (!initialized) return;
    navigate(showTransformControls ? '#show-transform' : '#');
  }, [navigate, initialized, showTransformControls]);

  return (
    <>
      <Stats />

      <OrbitControls dampingFactor={0.18} makeDefault />

      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight
        color={0xffffff}
        intensity={1}
        position={[3, 3, 3]}
        castShadow
      />

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
