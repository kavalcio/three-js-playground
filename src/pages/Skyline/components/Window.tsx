export const Window = ({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) => {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[0.2, 0.3]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
};
