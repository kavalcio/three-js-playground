import { Box, Typography } from '@mui/material';
import { Canvas } from '@react-three/fiber';
import { useState } from 'react';

import { DiceCountButton } from './components';
import { DIE_TYPES } from './constants';
import { Scene } from './Scene';

export const DiceFiber = () => {
  const [diceRollSum, setDiceRollSum] = useState(null);

  const [diceCounts, setDiceCounts] = useState(() =>
    DIE_TYPES.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {}),
  );

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
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        {DIE_TYPES.map((dieType) => (
          <DiceCountButton
            key={dieType}
            dieType={dieType}
            diceCounts={diceCounts}
            setDiceCounts={setDiceCounts}
          />
        ))}
      </Box>
    </>
  );
};
