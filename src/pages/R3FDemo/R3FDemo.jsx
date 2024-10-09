import { Canvas } from '@react-three/fiber';

import { Scene } from './components';

export const R3FDemo = () => {
  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <Scene />
    </Canvas>
  );
};
