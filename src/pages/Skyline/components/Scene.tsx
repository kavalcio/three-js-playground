import { Environment, OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';

const BUILDING_COUNT = 20;
const BUILDING_DIMENSIONS = {
  y: { min: 1, max: 10 },
  x: { min: 0.5, max: 3 },
  z: { min: 0.5, max: 3 },
};
const STAGE_SIZE = 26;
const SPAWN_AREA_SIZE = STAGE_SIZE / 2 - 1;

const randDimension = ({ min, max }: { min: number; max: number }) => {
  return Math.random() * (max - min) + min;
};

export const Scene = () => {
  return (
    <>
      <Perf position="top-left" />
      <Environment preset="sunset" />
      <OrbitControls dampingFactor={0.18} makeDefault />
      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight intensity={0.7} position={[3, 10, 0]} />
      {Array.from({ length: BUILDING_COUNT }, (_, i) => i).map((i) => {
        const height = randDimension(BUILDING_DIMENSIONS.y);
        return (
          <mesh
            key={i}
            position={[
              Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
              height / 2,
              Math.random() * SPAWN_AREA_SIZE - SPAWN_AREA_SIZE / 2,
            ]}
          >
            <boxGeometry
              args={[
                randDimension(BUILDING_DIMENSIONS.x),
                height + 0.01,
                randDimension(BUILDING_DIMENSIONS.z),
              ]}
            />
            <meshStandardMaterial color="orange" />
          </mesh>
        );
      })}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[STAGE_SIZE, STAGE_SIZE]} />
        <meshStandardMaterial color={0x99dd44} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
