export const Environment = () => {
  return (
    <>
      <ambientLight color={0x404040} intensity={1.5} />
      <directionalLight
        color={0xffffff}
        intensity={1}
        position={[6, 4, 3]}
        castShadow
      />
    </>
  );
};
