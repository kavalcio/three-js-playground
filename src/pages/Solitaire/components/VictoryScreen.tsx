import { Box, Typography } from '@mui/material';
import Confetti from 'react-confetti-boom';

export const VictoryScreen = ({ onNewGame }: { onNewGame: () => void }) => {
  return (
    <>
      <Box
        sx={{
          position: 'absolute',
          width: 300,
          height: 200,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10000,
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
        }}
      >
        <Typography
          sx={{
            color: 'black',
            fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
            fontSize: 30,
          }}
        >
          YOU WIN!!!
        </Typography>
        <button style={{ width: 'fit-content' }} onClick={onNewGame}>
          new game
        </button>
      </Box>
      <Confetti mode="fall" style={{ zIndex: 10001 }} />
    </>
  );
};
