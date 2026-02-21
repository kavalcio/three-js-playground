import {
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
  PresentationControls,
  useKeyboardControls,
} from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import * as THREE from 'three';

const speed = 5;
const rotationSpeed = 3;
const LIN_VEL_SCALE = 5;
const ANG_VEL_SCALE = 5;

// TODO; limit top velocity somehow
// TODO: add button to stabilize movement, bring linvel and angvel to 0
// TODO: disconnect character rotation and container rotation, lerp between the two for smoother camera movement
// TODO: dont create Vector3 instances every frame, reuse refs instead
export const CharacterController = ({
  materialRef,
}: {
  materialRef: React.RefObject<THREE.ShaderMaterial | null>;
}) => {
  const character = useRef<THREE.Group | null>(null);
  const cameraTarget = useRef<THREE.Group | null>(null);
  const cameraPosition = useRef<THREE.Group | null>(null);
  const cameraLookAt = useRef<THREE.Vector3>(new THREE.Vector3());
  const characterWorldRotation = useRef<THREE.Quaternion>(
    new THREE.Quaternion(),
  );

  const rb = useRef<RapierRigidBody>(null);

  const [_, getKeys] = useKeyboardControls(); // useKeyboardControls returns [subscribe, get, api]

  // Ensure OrbitControls' target is updated to prevent glitches if using both
  // You can also use OrbitControls with makeDefault and update its target
  useFrame((state, delta) => {
    const {
      forward,
      back,
      strafeLeft,
      strafeRight,
      rotateLeft,
      rotateRight,
      up,
      down,
    } = getKeys();

    character.current?.getWorldQuaternion(characterWorldRotation.current);

    // Calculate direction vector based on input
    const direction = new THREE.Vector3(
      strafeRight ? 1 : strafeLeft ? -1 : 0,
      up ? 1 : down ? -1 : 0,
      back ? 1 : forward ? -1 : 0,
    )
      .normalize()
      .applyQuaternion(characterWorldRotation.current);

    const rotationVector = new THREE.Vector3(
      0,
      rotateLeft ? 1 : rotateRight ? -1 : 0,
      0,
    );

    // if (character.current) {
    //   rotationTarget.current += rotationVector.y * rotationSpeed * delta;

    //   character.current.rotation.y = THREE.MathUtils.lerp(
    //     character.current.rotation.y,
    //     rotationTarget.current,
    //     0.08,
    //   );

    //   character.current.position.x +=
    //     -Math.sin(character.current.rotation.y) * direction.z * speed * delta +
    //     Math.cos(character.current.rotation.y) * direction.x * speed * delta;
    //   character.current.position.z +=
    //     -Math.cos(character.current.rotation.y) * direction.z * speed * delta -
    //     Math.sin(character.current.rotation.y) * direction.x * speed * delta;
    // }

    if (rb.current) {
      // const linvel = rb.current.linvel();
      // const speed = Math.sqrt(
      //   Math.pow(linvel.x, 2) + Math.pow(linvel.y, 2) + Math.pow(linvel.z, 2),
      // );
      // console.log(speed, linvel);
      rb.current.addForce(direction.multiplyScalar(LIN_VEL_SCALE), true);
      rb.current.addTorque(rotationVector.multiplyScalar(ANG_VEL_SCALE), true);
    }

    // Move the camera to follow the character
    cameraPosition.current?.getWorldPosition(state.camera.position);

    // Rotate the camera to look at the target point in front of the character
    if (cameraTarget.current) {
      cameraTarget.current.getWorldPosition(cameraLookAt.current);

      state.camera.lookAt(cameraLookAt.current);
    }

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
  });

  return (
    <group>
      <RigidBody
        colliders="ball"
        ref={rb}
        linearDamping={5}
        angularDamping={55}
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
    </group>
  );
};
