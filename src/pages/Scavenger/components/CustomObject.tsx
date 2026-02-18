import { DoubleSide } from 'three';

export const CustomObject = () => {
  return (
    <mesh>
      <boxGeometry />
      <meshBasicMaterial side={DoubleSide} />
    </mesh>
  );
};
