import { Canvas } from '@react-three/fiber';

import { Scene } from './components';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';

export const DiceFiber = () => {
  const [diceRollSum, setDiceRollSum] = useState(null);
  return (
    <>
      <Canvas
        shadows
        camera={{ fov: 25, position: [25, 45, 35] }}
        style={{ height: '100vh', width: '100vw' }}
      >
        <Scene diceRollSum={diceRollSum} setDiceRollSum={setDiceRollSum} />
      </Canvas>
      {diceRollSum !== null && (
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          <Typography>Result: {diceRollSum}</Typography>
        </Box>
      )}
    </>
  );
};
