import { InstancedRigidBodies } from '@react-three/rapier';

import { MAX_DIE_COUNT } from '../constants';

export const DiceRigidBodies = ({
  dieType,
  diceInstances,
  rigidBodyRef,
  instancedMeshRef,
  diceModels,
  incrementSleepingDiceCount,
  isDebug,
}) => {
  return (
    <InstancedRigidBodies
      ref={rigidBodyRef}
      instances={diceInstances}
      gravityScale={3}
      colliders="hull"
      onSleep={incrementSleepingDiceCount}
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
          // normalMap={diceModels.nodes[dieType].material.map}
          wireframe={isDebug}
        />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};
