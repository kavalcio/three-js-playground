import { useGLTF, useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CollisionEnterPayload,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

import { AudioHandler, GameStateHandler } from '../utils';

const LIN_ACC = 0.07; // Linear acceleration
const ANG_ACC = 0.004; // Angular acceleration
const ANG_ACC_MOUSE = 1 / 1000;
const PLAYER_SCALE = 0.3;

const collisionSoundPool = ['bang1', 'bang2', 'bang3', 'bang4'];

export const CharacterController = ({
  materialRef,
  canvasRef,
  audioHandler,
  gameStateHandler,
}: {
  materialRef: React.RefObject<THREE.ShaderMaterial | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  audioHandler: React.RefObject<AudioHandler>;
  gameStateHandler: React.RefObject<GameStateHandler>;
}) => {
  const character = useRef<THREE.Group | null>(null);
  const cameraTarget = useRef<THREE.Group | null>(null);
  const cameraPosition = useRef<THREE.Group | null>(null);
  const cameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const characterWorldRotation = useRef<THREE.Quaternion>(
    new THREE.Quaternion(),
  );

  const linearDirection = useRef<THREE.Vector3>(new THREE.Vector3());
  const angularDirection = useRef<THREE.Vector3>(new THREE.Vector3());

  const wasAccelerating = useRef(false);

  const rb = useRef<RapierRigidBody>(null);

  const model = useGLTF('/models/scavenger/player.glb');

  const [_, getKeys] = useKeyboardControls();

  useFrame((state) => {
    const {
      forward,
      back,
      up,
      down,
      strafeLeft,
      strafeRight,
      rollCW,
      rollCCW,
      stabilize,
    } = getKeys();

    const anyKeyPressed =
      forward ||
      back ||
      strafeLeft ||
      strafeRight ||
      rollCW ||
      rollCCW ||
      up ||
      down ||
      stabilize;

    const isAccelerating =
      forward || back || strafeLeft || strafeRight || up || down;

    if (!wasAccelerating.current && isAccelerating) {
      // Start playing acceleration sound
      audioHandler.current.fade('hiss', 0.04, 0.08);
    } else if (wasAccelerating.current && !isAccelerating) {
      // Stop playing acceleration sound
      audioHandler.current.fade('hiss', 0.3, 0);
    }
    wasAccelerating.current = isAccelerating;

    character.current?.getWorldQuaternion(characterWorldRotation.current);

    if (anyKeyPressed && rb.current) {
      // Calculate direction vector based on input
      if (stabilize) {
        const linvel = rb.current.linvel();
        linearDirection.current
          .set(linvel.x, linvel.y, linvel.z)
          .multiplyScalar(-1)
          .normalize();

        const linvelMagnitude = Math.sqrt(
          Math.pow(linvel.x, 2) + Math.pow(linvel.y, 2) + Math.pow(linvel.z, 2),
        );

        if (linvelMagnitude > 0.001) {
          rb.current.applyImpulse(
            linearDirection.current.multiplyScalar(
              Math.min(linvelMagnitude, LIN_ACC),
            ),
            true,
          );
        }
      } else {
        linearDirection.current
          .set(
            strafeRight ? 1 : strafeLeft ? -1 : 0,
            up ? 1 : down ? -1 : 0,
            back ? 1 : forward ? -1 : 0,
          )
          .normalize()
          .applyQuaternion(characterWorldRotation.current);

        angularDirection.current
          .set(0, 0, rollCCW ? 1 : rollCW ? -1 : 0)
          .normalize()
          .applyQuaternion(characterWorldRotation.current);

        rb.current.applyImpulse(
          linearDirection.current.multiplyScalar(LIN_ACC),
          true,
        );
        rb.current.applyTorqueImpulse(
          angularDirection.current.multiplyScalar(ANG_ACC),
          true,
        );
      }
    }

    // Move the camera to follow the character
    cameraPosition.current?.getWorldPosition(state.camera.position);

    // Rotate the camera to look at the target point in front of the character
    // TODO: the next two lines get overridden by the getWorldQuaternion call at the end of this block
    // cameraTarget.current?.getWorldPosition(cameraLookAt.current);
    // state.camera.lookAt(cameraLookAt.current);
    cameraPosition.current?.getWorldQuaternion(state.camera.quaternion);

    // Update player position in shader uniforms for visibility range calculation
    if (materialRef.current) {
      character.current?.getWorldPosition(
        materialRef.current.uniforms.uPlayerWorldPosition.value,
      );
    }
  });

  const onPlayerCollisionEnter = useCallback(
    ({ target, other }: CollisionEnterPayload) => {
      const tv = target.rigidBody!.linvel();
      const ov = other.rigidBody!.linvel();
      const cv = { x: tv.x - ov.x, y: tv.y - ov.y, z: tv.z - ov.z }; // collision velocity
      const collisionSpeed = Math.sqrt(
        Math.pow(cv.x, 2) + Math.pow(cv.y, 2) + Math.pow(cv.z, 2),
      );
      console.log('collision', collisionSpeed);

      const soundToPlay =
        collisionSoundPool[
        Math.floor(Math.random() * collisionSoundPool.length)
        ];

      audioHandler.current.play(soundToPlay, {
        reverb: 'hall',
        lowpass: 2000,
        volume: Math.max(0.2, Math.min(1.5, collisionSpeed / 10)),
      });

      const canCollide = gameStateHandler.current.handleCollision();
      if (!canCollide) return;
      gameStateHandler.current.reduceHealth(collisionSpeed);
    },
    [
      gameStateHandler,
      gameStateHandler.current,
      audioHandler,
      audioHandler.current,
    ],
  );

  useEffect(() => {
    // Handle pointer locking and character rotation based on mouse movement
    const requestPointerLock = async () => {
      await canvasRef.current?.requestPointerLock({
        unadjustedMovement: true,
      });
    };
    const canvas = canvasRef.current;
    canvas?.addEventListener('click', requestPointerLock);

    const updateMousePosition = (e: MouseEvent) => {
      if (e.movementX || e.movementY) {
        const rotationImpulse = new THREE.Vector3(
          -e.movementY * ANG_ACC_MOUSE,
          -e.movementX * ANG_ACC_MOUSE,
          0,
        ).applyQuaternion(characterWorldRotation.current);

        rb.current!.applyTorqueImpulse(
          { x: rotationImpulse.x, y: rotationImpulse.y, z: rotationImpulse.z },
          true,
        );
      }
    };
    const onPointerLockChange = () => {
      if (document.pointerLockElement === canvasRef.current) {
        console.log('pointer: LOCKED');
        document.addEventListener('mousemove', updateMousePosition);
        audioHandler.current.play('drone', {
          loop: true,
          lowpass: 500,
          volume: 0.4,
        });
        audioHandler.current.play('hiss', {
          loop: true,
          volume: 0,
          lowpass: 5000,
        });
      } else {
        console.log('pointer: UNLOCKED');
        document.removeEventListener('mousemove', updateMousePosition);
        audioHandler.current.pause('drone');
        audioHandler.current.pause('hiss');
      }
    };
    document.addEventListener('pointerlockchange', onPointerLockChange);

    return () => {
      canvas?.removeEventListener('click', requestPointerLock);
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
    };
  }, [canvasRef, rb, audioHandler]);

  return (
    <>
      <RigidBody
        colliders="hull"
        ref={rb}
        linearDamping={0.5}
        angularDamping={3}
        onCollisionEnter={onPlayerCollisionEnter}
      >
        <group ref={character}>
          <mesh
            castShadow
            scale={[PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            {/* <sphereGeometry args={[0.6]} /> */}
            <bufferGeometry attach="geometry" {...model.nodes.ship.geometry} />
            <meshStandardMaterial />
          </mesh>
          {/* TODO: position of this cameratarget might not be getting used correctly */}
          <group ref={cameraTarget} position-z={1} />
          <group ref={cameraPosition} position-y={1} position-z={5} />
        </group>
      </RigidBody>
    </>
  );
};
