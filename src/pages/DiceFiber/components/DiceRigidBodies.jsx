import { InstancedRigidBodies } from '@react-three/rapier';
import { useMemo } from 'react';

import { MAX_DIE_COUNT } from '../constants';

// TODO: cube gltf is too big, scale it down by 0.5x
export const DiceRigidBodies = ({
  dieType,
  diceInstances,
  rigidBodyRef,
  instancedMeshRef,
  diceModels,
  debug,
}) => {
  const mesh = useMemo(() => {
    const m = diceModels.nodes[dieType];
    // m.geometry.scale = new THREE.Vector3(0.2, 0.2, 0.2);
    return m;
  }, [diceModels, dieType]);

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
      gravityScale={2}
      colliders="hull"
    >
      <instancedMesh
        ref={instancedMeshRef}
        args={[undefined, undefined, MAX_DIE_COUNT]}
        count={diceInstances.length}
        frustumCulled={false}
        // scale={[0.2, 0.2, 0.2]}
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
        <bufferGeometry attach="geometry" {...mesh.geometry} />
        <meshStandardMaterial
          attach="material"
          {...mesh.material}
          wireframe={debug}
        />
      </instancedMesh>
    </InstancedRigidBodies>
  );
};
