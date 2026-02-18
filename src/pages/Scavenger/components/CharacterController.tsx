import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { use, useRef } from 'react';
import * as THREE from 'three';

const speed = 5;
const rotationSpeed = 3;

// TODO: disconnect character rotation and container rotation, lerp between the two for smoother camera movement
// TODO: dont create Vector3 instances every frame, reuse refs instead
export const CharacterController = () => {
  const container = useRef<THREE.Group | null>(null);
  const character = useRef<THREE.Group | null>(null);
  const cameraTarget = useRef<THREE.Group | null>(null);
  const cameraPosition = useRef<THREE.Group | null>(null);
  const cameraWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const cameraLookAtWorldPosition = useRef<THREE.Vector3>(new THREE.Vector3());
  const rotationTarget = useRef<number>(0);

  const [_, getKeys] = useKeyboardControls(); // useKeyboardControls returns [subscribe, get, api]

  // Ensure OrbitControls' target is updated to prevent glitches if using both
  // You can also use OrbitControls with makeDefault and update its target
  useFrame((state, delta) => {
    const { forward, back, strafeLeft, strafeRight, rotateLeft, rotateRight } =
      getKeys();
    console.log(state.controls);

    // Calculate direction vector based on input
    const direction = new THREE.Vector3();
    const frontVector = new THREE.Vector3(0, 0, back ? 1 : forward ? -1 : 0);
    const sideVector = new THREE.Vector3(
      strafeLeft ? -1 : strafeRight ? 1 : 0,
      0,
      0,
    );
    const rotationVector = new THREE.Vector3(
      0,
      rotateLeft ? 1 : rotateRight ? -1 : 0,
      0,
    );

    direction.subVectors(frontVector, sideVector).normalize();
    // Apply camera rotation to direction for world-relative movement
    // .applyEuler(camera.rotation);

    if (character.current) {
      rotationTarget.current += rotationVector.y * rotationSpeed * delta;

      character.current.rotation.y = THREE.MathUtils.lerp(
        character.current.rotation.y,
        rotationTarget.current,
        0.08,
      );

      character.current.position.x +=
        -Math.sin(character.current.rotation.y) * direction.z * speed * delta +
        Math.cos(character.current.rotation.y) * direction.x * speed * delta;
      character.current.position.z +=
        -Math.cos(character.current.rotation.y) * direction.z * speed * delta -
        Math.sin(character.current.rotation.y) * direction.x * speed * delta;
    }

    // Move the camera to follow the character
    cameraPosition.current?.getWorldPosition(cameraWorldPosition.current);
    state.camera.position.lerp(cameraWorldPosition.current, 0.1);

    // Rotate the camera to look at the target point in front of the character
    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
      cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

      state.camera.lookAt(cameraLookAt.current);
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
  });

  return (
    <group>
      {/* <mesh ref={charRef}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh> */}
      <group ref={container}>
        <group ref={character}>
          <mesh castShadow>
            <boxGeometry />
            <meshStandardMaterial />
          </mesh>
          <group ref={cameraTarget} position-z={1.5} />
          <group ref={cameraPosition} position-y={4} position-z={-4} />
        </group>
      </group>
    </group>
  );
};
