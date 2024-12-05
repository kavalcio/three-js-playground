import { Box, Typography } from '@mui/material';

import { Button } from '.';

export const DiceCountButton = ({ dieType, diceCounts, setDiceCounts }) => {
  return (
    <Box sx={{ position: 'relative' }}>
      {diceCounts[dieType] > 0 && (
        <Box
          sx={{
            position: 'absolute',
            top: -15,
            right: -15,
            height: 25,
            width: 25,
            borderRadius: '50%',
            cursor: 'pointer',
            backgroundColor: 'darkgreen',
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { backgroundColor: 'green' },
          }}
          onClick={() =>
            setDiceCounts({
              ...diceCounts,
              [dieType]: 0,
            })
          }
        >
          <Typography sx={{ fontSize: 12 }}>{diceCounts[dieType]}</Typography>
        </Box>
      )}
      <Button
        sx={{
          height: 60,
          width: 60,
          borderRadius: '50%',
        }}
        onClick={() =>
          setDiceCounts({ ...diceCounts, [dieType]: diceCounts[dieType] + 1 })
        }
        onContextMenu={(e) => {
          e.preventDefault();
          setDiceCounts({
            ...diceCounts,
            [dieType]: Math.max(diceCounts[dieType] - 1, 0),
          });
        }}
      >
        <Typography sx={{ pointerEvents: 'none', userSelect: 'none' }}>
          {dieType}
        </Typography>
      </Button>
    </Box>
  );
};
