import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const speed = 5;

export const CharacterController = () => {
  const container = useRef<THREE.Group | null>(null);
  const cameraTarget = useRef<THREE.Group | null>(null);
  const cameraPosition = useRef<THREE.Group | null>(null);
  const character = useRef<THREE.Mesh | null>(null);
  const [_, getKeys] = useKeyboardControls(); // useKeyboardControls returns [subscribe, get, api]

  // Ensure OrbitControls' target is updated to prevent glitches if using both
  // You can also use OrbitControls with makeDefault and update its target
  useFrame((state, delta) => {
    const { forward, back, left, right } = getKeys();

    // Calculate direction vector based on input
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, back ? 1 : forward ? -1 : 0);
    const sideVector = new THREE.Vector3(left ? -1 : right ? 1 : 0, 0, 0);

    direction.subVectors(frontVector, sideVector).normalize();
    // Apply camera rotation to direction for world-relative movement
    // .applyEuler(camera.rotation);

    // Move the camera/object
    // camera.position.x += -direction.x * speed * delta;
    // camera.position.z += direction.z * speed * delta;

    if (character.current) {
      character.current.position.x += -direction.x * speed * delta;
      character.current.position.z += direction.z * speed * delta;
    }
    // If using OrbitControls, keep its target synced to the camera's position
    // const controls = state.controls;
    // if (controls) controls.target.copy(camera.position);
  });

  // useFrame(({ camera, mouse }) => {
  //   if (rb.current) {
  //     const vel = rb.current.linvel();

  //     const movement = {
  //       x: 0,
  //       z: 0,
  //     };

  //     if (get().forward) {
  //       movement.z = 1;
  //     }
  //     if (get().backward) {
  //       movement.z = -1;
  //     }

  //     let speed = get().run ? RUN_SPEED : WALK_SPEED;

  //     if (isClicking.current) {
  //       console.log("clicking", mouse.x, mouse.y);
  //       if (Math.abs(mouse.x) > 0.1) {
  //         movement.x = -mouse.x;
  //       }
  //       movement.z = mouse.y + 0.4;
  //       if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
  //         speed = RUN_SPEED;
  //       }
  //     }

  //     if (get().left) {
  //       movement.x = 1;
  //     }
  //     if (get().right) {
  //       movement.x = -1;
  //     }

  //     if (movement.x !== 0) {
  //       rotationTarget.current += ROTATION_SPEED * movement.x;
  //     }

  //     if (movement.x !== 0 || movement.z !== 0) {
  //       characterRotationTarget.current = Math.atan2(movement.x, movement.z);
  //       vel.x =
  //         Math.sin(rotationTarget.current + characterRotationTarget.current) *
  //         speed;
  //       vel.z =
  //         Math.cos(rotationTarget.current + characterRotationTarget.current) *
  //         speed;
  //       if (speed === RUN_SPEED) {
  //         setAnimation("run");
  //       } else {
  //         setAnimation("walk");
  //       }
  //     } else {
  //       setAnimation("idle");
  //     }
  //     character.current.rotation.y = lerpAngle(
  //       character.current.rotation.y,
  //       characterRotationTarget.current,
  //       0.1
  //     );

  //     rb.current.setLinvel(vel, true);
  //   }

  //   // if (!container.current) return;

  //   // CAMERA
  //   container.current.rotation.y = THREE.MathUtils.lerp(
  //     container.current.rotation.y,
  //     rotationTarget.current,
  //     0.1
  //   );

  //   cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
  //   camera.position.lerp(cameraWorldPosition.current, 0.1);

  //   if (cameraTarget.current) {
  //     cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
  //     cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

  //     camera.lookAt(cameraLookAt.current);
  //   }
  // });

  return (
    <group>
      {/* <mesh ref={charRef}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={4} position-z={-4} />
        <group ref={character}>
          <mesh ref={character}>
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
        </group>
      </group>
    </group>
  );
};
