import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { CharacterController, HUD, Scene } from './components';

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

Things to implement:
- [x] WASD controls
- [x] Camera following player
- [x] Object-player collisions
- [ ] Player and environment models
- [ ] Animated model
- [ ] HUD
- [ ] Loading and restarting scene

*/

export const Scavenger = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const map = useMemo(
    () => [
      { name: 'forward', keys: ['KeyW'] },
      { name: 'back', keys: ['KeyS'] },
      { name: 'strafeLeft', keys: ['KeyA'] },
      { name: 'strafeRight', keys: ['KeyD'] },
      { name: 'rollCCW', keys: ['KeyQ'] },
      { name: 'rollCW', keys: ['KeyE'] },
      { name: 'up', keys: ['Shift'] },
      { name: 'down', keys: ['Control'] },
      { name: 'stabilize', keys: ['Space'] },
      { name: 'scanArea', keys: ['KeyF'] },
    ],
    [],
  );

  const [health, setHealth] = useState(70);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  return (
    <>
      <Canvas
        ref={canvasRef}
        shadows
        style={{ height: '100vh', width: '100vw' }}
        camera={{ fov: 45 }}
      >
        <KeyboardControls map={map}>
          <Physics debug gravity={[0, 0, 0]}>
            <Scene
              materialRef={materialRef}
              // canvasRef={canvasRef}
            />
            <CharacterController
              materialRef={materialRef}
              canvasRef={canvasRef}
              setHealth={setHealth}
            />
          </Physics>
        </KeyboardControls>
      </Canvas>
      <HUD health={health} />
    </>
  );
};
