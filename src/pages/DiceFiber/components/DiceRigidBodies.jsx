import { InstancedRigidBodies } from '@react-three/rapier';

import { MAX_DIE_COUNT } from '../constants';

export const DiceRigidBodies = ({
  dieType,
  diceInstances,
  rigidBodyRef,
  instancedMeshRef,
  diceModels,
  debug,
}) => {
  return (
    <InstancedRigidBodies
      ref={rigidBodyRef}
      instances={diceInstances}
      // TODO: randomize this on every reset, but how? doing random here causes it to update every frame
      // linearVelocity={[
      //   Math.random() - 0.5,
      //   -5 * Math.random(),
      //   Math.random() - 0.5,
      // ]}
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
