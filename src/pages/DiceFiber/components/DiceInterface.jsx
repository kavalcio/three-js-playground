import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { DIE_TYPES } from '../constants';
import { Button, DiceCountButton } from './';

export const DiceInterface = ({
  rollDice,
  diceRollSum,
  areAllDiceSleeping,
}) => {
  const [pendingDiceCounts, setPendingDiceCounts] = useState(() =>
    DIE_TYPES.reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {}),
  );

  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '5%',
          display: 'flex',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        {DIE_TYPES.map((dieType) => (
          <DiceCountButton
            key={dieType}
            dieType={dieType}
            diceCounts={pendingDiceCounts}
            setDiceCounts={setPendingDiceCounts}
          />
        ))}
        <Button
          sx={{ height: 60, width: 100, ml: 2 }}
          onClick={() => rollDice({ diceCounts: { ...pendingDiceCounts } })}
        >
          <Typography sx={{ pointerEvents: 'none', userSelect: 'none' }}>
            Roll
          </Typography>
        </Button>
      </Box>
      {!!diceRollSum && (
        <Box
          sx={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            pointerEvents: 'none',
            userSelect: 'none',
            color: areAllDiceSleeping ? 'green' : 'white',
          }}
        >
          <Typography>Result: {diceRollSum}</Typography>
        </Box>
      )}
    </>
  );
};
