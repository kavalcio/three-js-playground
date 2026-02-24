import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { RapierRigidBody, RigidBody } from '@react-three/rapier';
import { useRef } from 'react';
import * as THREE from 'three';

const LIN_ACC = 1; // Linear acceleration
const ANG_ACC = 0.3; // Angular acceleration

// TODO: do something on collisions - damage, sounds, game over?
// TODO: add some particle effect in the void that helps you tell that you're rotating or moving even if there are not objects around
// TODO; limit top velocity somehow
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

  const linearDirection = useRef<THREE.Vector3>(new THREE.Vector3());
  const angularDirection = useRef<THREE.Vector3>(new THREE.Vector3());

  const rb = useRef<RapierRigidBody>(null);

  const [_, getKeys] = useKeyboardControls();

  useFrame((state) => {
    const {
      forward,
      back,
      strafeLeft,
      strafeRight,
      rotateLeft,
      rotateRight,
      up,
      down,
      stabilize,
    } = getKeys();

    const anyKeyPressed =
      forward ||
      back ||
      strafeLeft ||
      strafeRight ||
      rotateLeft ||
      rotateRight ||
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
        angularDirection.current
          .set(angvel.x, angvel.y, angvel.x)
          .multiplyScalar(-1)
          .normalize();

        const linvelMagnitude = Math.sqrt(
          Math.pow(linvel.x, 2) + Math.pow(linvel.y, 2) + Math.pow(linvel.z, 2),
        );
        const angvelMagnitude = Math.sqrt(
          Math.pow(angvel.x, 2) + Math.pow(angvel.y, 2) + Math.pow(angvel.z, 2),
        );

        if (linvelMagnitude > 0.001) {
          rb.current.applyImpulse(
            linearDirection.current.multiplyScalar(
              Math.min(linvelMagnitude, LIN_ACC),
            ),
            true,
          );
        }
        if (angvelMagnitude > 0.001) {
          rb.current.applyTorqueImpulse(
            angularDirection.current.multiplyScalar(
              Math.min(angvelMagnitude, ANG_ACC),
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
        angularDirection.current.set(
          0,
          rotateLeft ? 1 : rotateRight ? -1 : 0,
          0,
        );

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
        linearDamping={0.5}
        angularDamping={3}
        // linearDamping={505}
        // angularDamping={55}
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
