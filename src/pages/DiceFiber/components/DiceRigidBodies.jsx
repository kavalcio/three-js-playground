import { InstancedRigidBodies } from '@react-three/rapier';

import { MAX_DIE_COUNT } from '../constants';

export const DiceRigidBodies = ({
  dieType,
  diceInstances,
  rigidBodyRef,
  instancedMeshRef,
  diceModels,
  isDebug,
}) => {
  return (
    <InstancedRigidBodies
      ref={rigidBodyRef}
      instances={diceInstances}
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
          wireframe={isDebug}
        />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};
