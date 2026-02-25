import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CollisionEnterPayload,
  RapierRigidBody,
  RigidBody,
} from '@react-three/rapier';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';

const LIN_ACC = 1; // Linear acceleration
const ANG_ACC = 0.3; // Angular acceleration

// TODO: do something on collisions - damage, sounds, game over?
// TODO: add some particle effect in the void that helps you tell that you're rotating or moving even if there are not objects around
// TODO; limit top velocity somehow
// TODO: disconnect character rotation and container rotation, lerp between the two for smoother camera movement
export const CharacterController = ({
  materialRef,
  canvasRef,
}: {
  materialRef: React.RefObject<THREE.ShaderMaterial | null>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
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

  const rb = useRef<RapierRigidBody>(null);

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

    // TODO: characterWorldRotation keeps getting skewed and character collides with things, throwing route off axis
    character.current?.getWorldQuaternion(characterWorldRotation.current);

    if (anyKeyPressed && rb.current) {
      // Calculate direction vector based on input
      if (stabilize) {
        const linvel = rb.current.linvel();
        linearDirection.current
          .set(linvel.x, linvel.y, linvel.z)
          .multiplyScalar(-1)
          .normalize();

        const angvel = rb.current.angvel();

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

        // TODO: do we need to apply character world rotation quaternion to this?
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
    cameraTarget.current?.getWorldPosition(cameraLookAt.current);
    state.camera.lookAt(cameraLookAt.current);

    cameraPosition.current?.getWorldQuaternion(state.camera.quaternion);

    // state.camera.setRotationFromQuaternion(characterWorldRotation.current);
    // const camrot = new THREE.Quaternion();
    // cameraPosition.current?.getWorldQuaternion(camrot);
    // state.camera.setRotationFromQuaternion(camrot);

    console.log(state.camera.rotation);

    // Update player position in shader uniforms for visibility range calculation
    if (materialRef.current) {
      character.current?.getWorldPosition(
        materialRef.current.uniforms.uPlayerWorldPosition.value,
      );
    }

    // If using OrbitControls, keep its target synced to the player's position
    // if (controls) controls.target.copy(character.current?.position);
    // state.camera.lookAt(character.current.position);
    // state.camera.position.x += -direction.x * speed * delta;
    // state.camera.position.z += direction.z * speed * delta;

    // Move the camera to follow the character
    // if (cameraPosition.current && character.current) {
    //   const desiredPosition = new THREE.Vector3()
    //     .copy(character.current.position)
    //     .add(new THREE.Vector3(0, 4, -4));
    //   cameraPosition.current.position.lerp(desiredPosition, 0.1);
    // }

    // rb.current?.
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

      // TODO: do something based on how hard the objects collided
      // TODO: add a period of immunity after a collision so that back to back collisions dont insta kill player
    },
    [],
  );

  useEffect(() => {
    // Handle pointer locking and character rotation based on mouse movement
    canvasRef.current.addEventListener('click', async () => {
      await canvasRef.current.requestPointerLock({
        unadjustedMovement: true,
      });
    });
    const updateMousePosition = (e: MouseEvent) => {
      if (e.movementX || e.movementY) {
        const rotationImpulse = new THREE.Vector3(
          -e.movementY / 20,
          -e.movementX / 20,
          0,
        ).applyQuaternion(characterWorldRotation.current);

        rb.current!.applyTorqueImpulse(
          // { x: -e.movementY / 20, y: -e.movementX / 20, z: 0 },
          { x: rotationImpulse.x, y: rotationImpulse.y, z: rotationImpulse.z },
          true,
        );
      }
    };
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === canvasRef.current) {
        console.log('pointer: LOCKED');
        document.addEventListener('mousemove', updateMousePosition);
      } else {
        console.log('pointer: UNLOCKED');
        document.removeEventListener('mousemove', updateMousePosition);
      }
    });
  }, [canvasRef, rb]);
  return (
    <>
      <RigidBody
        colliders="ball"
        ref={rb}
        linearDamping={0.5}
        angularDamping={3}
        onCollisionEnter={onPlayerCollisionEnter}
      >
        <group ref={character}>
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial />
          </mesh>
          <group ref={cameraTarget} position-z={-2.5} />
          <group ref={cameraPosition} position-y={2} position-z={5} />
        </group>
      </RigidBody>
    </>
  );
};
