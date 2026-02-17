import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

import { Scene } from './components';

export const Scavenger = () => {
  const map = useMemo(
    () => [
      { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
      { name: 'back', keys: ['ArrowDown', 'KeyS'] },
      { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
      { name: 'right', keys: ['ArrowRight', 'KeyD'] },
      { name: 'jump', keys: ['Space'] },
    ],
    [],
  );
  return (
    <Canvas shadows style={{ height: '100vh', width: '100vw' }}>
      <KeyboardControls map={map}>
        <Scene />
      </KeyboardControls>
    </Canvas>
  );
};
