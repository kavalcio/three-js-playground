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
        onClick={(e) => {
          // TODO: scale impulse based on mass
          // TODO: randomize impulses
          // TODO: this sometimes causes dice that haven't been clicked to also get an impulse
          console.log('click', e.intersections[0].faceIndex);
          rigidBodyRef.current[e.intersections[0].instanceId].applyImpulse(
            { x: 0, y: 10, z: 0 },
            true,
          );
          // instanceRefs[key].rb.current[
          //   e.intersections[0].instanceId
          // ].applyTorqueImpulse({ x: 2, y: 2, z: 2 }, true);
        }}
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
