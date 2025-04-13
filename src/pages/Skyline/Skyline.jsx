import { Canvas } from '@react-three/fiber';

import { Scene } from './components';

export const Skyline = () => {
  return (
    <Canvas
      shadows
      camera={{ fov: 25, position: [25, 45, 35] }}
      style={{ height: '100vh', width: '100vw' }}
    >
      <Scene />
    </Canvas>
  );
};
