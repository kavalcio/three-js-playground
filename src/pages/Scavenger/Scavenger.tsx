import { KeyboardControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { CharacterController, HUD, Scene } from './components';
import { AudioHandler, GameStateHandler } from './utils';

/*
Bug-like drone traversing through a desolate landscape (need to make it feel like space/spaceship for it to fit challenge theme) digging through ruins for artifact fragments. Collecting enough fragments reveals pieces of information and lore.
- Drone design scarab-like, inspired by 40k necrons
- Inverse kinematics legs
- Render everything in wireframe (but not transparent faces)
- UI looks like terminator HUD
- Kind of lofi horror, like Outer Wilds. No immediate threat in the game but the feeling that you’re not alone, that there’s something right outside your field of vision.
- Sound and ambience very important. Droning, out of tune synth soundtrack? Maybe auto generate it live
- Fade objects with distance, like fog of war
- Need to make lanscape feel eerie and alien, spacey. Or maybe you’re exploring the carcass of a spaceship! Space hulk style. You move through hallways and chambers, distant echoey metallic clanging and scraping sounds every now and then.

Rendering effects:
- Postprocessing dithering
- Vertex snapping

Things to implement:
- [x] WASD controls
- [x] Camera following player
- [x] Object-player collisions
- [ ] Player and environment models
  - Drone design scarab-like, inspired by 40k necrons
- [ ] Sound effects
  - [x] Collision (pick randomly from a pool of sounds)
  - [x] Acceleration
  - [x] Environment scan
  - [ ] Player object push ability, if it exists
  - Dont forget to do attribution for sounds used
- [ ] Ambient sound
  - [x] Passive drone
  - [ ] Clanging and scraping sounds off in the distance, played at random intervals
- [ ] Better looking HUD
  - like terminator HUD
  - [ ] pause menu with controls shown
  - [ ] Loading and restarting scene
- [ ] Win condition
- [ ] Lose condition
- [ ] Postprocessing
- [ ] Particle effects for acceleration and collisions
- [ ] Floating particle effects for ambience
- [x] World-space grid effect in the material shader. Maybe also fresnel/outline to make shapes easier to distinguish
- [ ] Give player limited-use ability to push objects, maybe replenishable through pickups
- [ ] Procedurally generate the landscape to make it more interesting and replayable. Maybe have some pre-made chunks that get stitched together in a random order each time you play
- [ ] azerty keyboard support
*/

export const Scavenger = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const map = useMemo(
    () => [
      { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
      { name: 'back', keys: ['KeyS', 'ArrowDown'] },
      { name: 'strafeLeft', keys: ['KeyA', 'ArrowLeft'] },
      { name: 'strafeRight', keys: ['KeyD', 'ArrowRight'] },
      { name: 'rollCCW', keys: ['KeyQ'] },
      { name: 'rollCW', keys: ['KeyE'] },
      { name: 'up', keys: ['Shift'] },
      { name: 'down', keys: ['Control'] },
      { name: 'stabilize', keys: ['Space'] },
      { name: 'scanArea', keys: ['KeyF'] },
    ],
    [],
  );

  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const audioHandler = useRef(new AudioHandler());
  const gameStateHandler = useRef(new GameStateHandler());

  useEffect(() => {
    audioHandler.current.load('bang1', '/audio/bang1.mp3'); // https://freesound.org/people/nothayama/sounds/172497/
    audioHandler.current.load('bang2', '/audio/bang2.mp3'); // same as above
    audioHandler.current.load('bang3', '/audio/bang3.mp3'); // same as above
    audioHandler.current.load('bang4', '/audio/hollow_metal_bang.mp3'); // https://freesound.org/people/Artninja/sounds/699994/

    audioHandler.current.load('clang', '/audio/metallic-clangs.mp3'); // https://freesound.org/people/soundmary/sounds/194996/?
    audioHandler.current.load('drone', '/audio/cavern-drone.wav'); // https://freesound.org/people/loscolt890/sounds/434184/
    audioHandler.current.load('sonar', '/audio/sonar.wav'); // https://freesound.org/people/KIZILSUNGUR/sounds/70299/
    audioHandler.current.synthesizeHiss('hiss');
    audioHandler.current.loadReverbImpulse(
      'hall',
      '/audio/large-long-echo-hall.wav', // https://www.voxengo.com/impulses/
    );
  }, [audioHandler]);

  const [isPaused, setIsPaused] = useState(true);

  return (
    <>
      <Canvas
        ref={canvasRef}
        shadows
        style={{ height: '100vh', width: '100vw' }}
        camera={{ fov: 45 }}
      >
        <KeyboardControls map={map}>
          <Physics gravity={[0, 0, 0]} colliders={false}>
            <Scene materialRef={materialRef} audioHandler={audioHandler} />
            <CharacterController
              materialRef={materialRef}
              canvasRef={canvasRef}
              audioHandler={audioHandler}
              gameStateHandler={gameStateHandler}
              setIsPaused={setIsPaused}
            />
          </Physics>
        </KeyboardControls>
      </Canvas>
      <HUD
        canvasRef={canvasRef}
        gameStateHandler={gameStateHandler}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
      />
    </>
  );
};
