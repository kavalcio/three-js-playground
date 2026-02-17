import {
  OrbitControls,
  Stats,
  TransformControls,
  useKeyboardControls,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useControls } from 'leva';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as THREE from 'three';

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
    // cubeRef.current.rotation.x += delta;
    // cubeRef.current.rotation.y += delta;

    // groupRef.current.rotation.y += delta / 2;
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

  const { camera } = useThree();
  const [subscribeKeys, getKeys] = useKeyboardControls(); // useKeyboardControls returns [subscribe, get, api]
  const speed = 5;

  // Ensure OrbitControls' target is updated to prevent glitches if using both
  // You can also use OrbitControls with makeDefault and update its target

  useFrame((state, delta) => {
    const { forward, back, left, right } = getKeys();

    // Calculate direction vector based on input
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, back ? 1 : forward ? -1 : 0);
    const sideVector = new THREE.Vector3(left ? -1 : right ? 1 : 0, 0, 0);

    direction
      .subVectors(frontVector, sideVector)
      .normalize()
      // Apply camera rotation to direction for world-relative movement
      .applyEuler(camera.rotation);

    // Move the camera/object
    // camera.position.x += -direction.x * speed * delta;
    // camera.position.z += direction.z * speed * delta;

    cubeRef.current.position.x += -direction.x * speed * delta;
    cubeRef.current.position.z += direction.z * speed * delta;

    // If using OrbitControls, keep its target synced to the camera's position
    // const controls = state.controls;
    // if (controls) controls.target.copy(camera.position);
  });

  // return <OrbitControls />; // Example of using OrbitControls for mouse look

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
