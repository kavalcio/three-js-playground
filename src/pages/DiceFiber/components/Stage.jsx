import { CuboidCollider, RigidBody } from '@react-three/rapier';

import { STAGE_WIDTH } from '../constants';

export const Stage = () => {
  return (
    <>
      <directionalLight
        castShadow
        shadow-camera-top={STAGE_WIDTH / 1.5}
        shadow-camera-bottom={-STAGE_WIDTH / 1.5}
        shadow-camera-left={-STAGE_WIDTH / 1.5}
        shadow-camera-right={STAGE_WIDTH / 1.5}
        intensity={0.7}
        position={[3, 10, 0]}
      />
      <mesh position={[0, -1.5, 0]} receiveShadow>
        <boxGeometry args={[STAGE_WIDTH, 0.2, STAGE_WIDTH]} />
        <meshStandardMaterial wireframe={false} color={'#753b1a'} />
      </mesh>
      <RigidBody type="fixed">
        <CuboidCollider
          args={[STAGE_WIDTH / 2, 0.1, STAGE_WIDTH / 2]}
          position={[0, -1.5, 0]}
        />
        <CuboidCollider
          args={[0.1, 15, STAGE_WIDTH / 2]}
          position={[STAGE_WIDTH / 2, 13, 0]}
        />
        <CuboidCollider
          args={[0.1, 15, STAGE_WIDTH / 2]}
          position={[-STAGE_WIDTH / 2, 13, 0]}
        />
        <CuboidCollider
          args={[STAGE_WIDTH / 2, 15, 0.1]}
          position={[0, 13, STAGE_WIDTH / 2]}
        />
        <CuboidCollider
          args={[STAGE_WIDTH / 2, 15, 0.1]}
          position={[0, 13, -STAGE_WIDTH / 2]}
        />
      </RigidBody>
    </>
  );
};
