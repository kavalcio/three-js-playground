import { InstancedRigidBodies } from '@react-three/rapier';
import { useMemo } from 'react';

import { MAX_DIE_COUNT } from '../constants';

export const DiceRigidBodies = ({
  dieType,
  diceInstances,
  rigidBodyRef,
  instancedMeshRef,
  diceModels,
  debug,
}) => {
  // const randomLinearVelocity = useMemo(() => {
  //   const angle = Math.random() * Math.PI * 2;
  //   const speed = 10;
  //   return [Math.cos(angle) * speed, -5, Math.sin(angle) * speed];
  // }, [diceInstances]);

  return (
    <InstancedRigidBodies
      ref={rigidBodyRef}
      instances={diceInstances}
      // linearVelocity={randomLinearVelocity}
      // angularVelocity={[Math.random(), Math.random(), Math.random()]}
      gravityScale={3}
      colliders="hull"
    >
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, MAX_DIE_COUNT]}
        count={diceInstances.length}
        frustumCulled={false}
        castShadow
      >
        <bufferGeometry
          attach="geometry"
          {...diceModels.nodes[dieType].geometry}
        />
        <meshStandardMaterial
          attach="material"
          {...diceModels.nodes[dieType].material}
          wireframe={debug}
        />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};
