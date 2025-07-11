import { Canvas } from '@react-three/fiber';

import { Scene } from './components';

export const SolarSystem = () => {
  return (
    <Canvas
      shadows
      style={{ height: '100vh', width: '100vw' }}
      camera={{ fov: 35, position: [0, 0, 10] }}
    >
      <Scene />
    </Canvas>
  );
};
