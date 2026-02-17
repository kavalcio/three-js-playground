import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo } from 'react';

import { Scene } from './components';

/*
Bug-like drone traversing through a desolate landscape (need to make it feel like space/spaceship for it to fit challenge theme) digging through ruins for artifact fragments. Collecting enough fragments reveals pieces of information and lore.
- Drone design scarab-like, inspired by 40k necrons
- Inverse kinematics legs
- Render everything in wireframe (but not transparent faces)
- UI looks like terminator HUD
- Kind of lofi horror, like Outer Wilds. No immediate threat in the game but the feeling that you’re not alone, that there’s something right outside your field of vision.
- Sound and ambience very important. Droning, out of tune synth soundtrack? Maybe auto generate it live
- Fade objects with distance, like fog of war
- Need to make lanscape feel eerie and alient, spacey. Or maybe you’re exploring the carcass of a spaceship! Space hulk style. You move through hallways and chambers, distant echoey metallic clanging and scraping sounds every now and then.

Rendering effects:
- Maybe use hologram shader?
- Postprocessing dithering
- Vertex snapping
- Pixellation
- Fade objects with distance, like fog of war
- Maybe stipple shader

Things to implement:
- WASD controls
- Camera following player
- Player and environment models
- Object-player collisions (no physics needed)
- Animated model
- HUD
- Loading and restarting scene
- Inverse kinematics legs


*/

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
