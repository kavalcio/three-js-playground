import { Environment, OrbitControls } from '@react-three/drei';
import { Perf } from 'r3f-perf';
import * as THREE from 'three';

import { BUILDING_COUNT, STAGE_SIZE } from '../constants';
import { Building } from './Building';

/*
TODOs:
- Skybox
- Windows
- Balconies
- Allow setting and saving seeds
- Prevent buildings from overlapping
- Set a balance between building height and width
- Use instanced meshes
- Bloom
*/
export const Scene = () => {
  return (
    <>
      <Perf position="top-left" />
      <Environment preset="sunset" />
      <OrbitControls dampingFactor={0.18} makeDefault />
      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight intensity={0.7} position={[3, 10, 0]} />
      {Array.from({ length: BUILDING_COUNT }, (_, i) => i).map((i) => (
        <Building key={i} />
      ))}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[STAGE_SIZE, STAGE_SIZE]} />
        <meshStandardMaterial color={0x99dd44} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
};
