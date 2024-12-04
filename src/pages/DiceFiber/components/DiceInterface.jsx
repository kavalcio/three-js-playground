import { Box, Typography } from '@mui/material';
import { useState } from 'react';

import { DIE_TYPES } from '../constants';
import { DiceCountButton } from './';

export const DiceInterface = ({ applyDiceCounts, diceRollSum }) => {
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
        <Box
          sx={{
            backgroundColor: 'maroon',
            height: 60,
            width: 100,
            borderRadius: 4,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            ml: 2,
            '&:hover': { backgroundColor: 'darkred' },
          }}
          onClick={() => applyDiceCounts({ ...pendingDiceCounts })}
        >
          <Typography sx={{ pointerEvents: 'none', userSelect: 'none' }}>
            Roll
          </Typography>
        </Box>
      </Box>
      {!!diceRollSum && (
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
