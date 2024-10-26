import { Canvas } from '@react-three/fiber';

import { Scene } from './components';

export const DiceFiber = () => {
  return (
    <Canvas shadows style={{ height: '100vh', width: '100vw' }}>
      <Scene />
    </Canvas>
  );
};
