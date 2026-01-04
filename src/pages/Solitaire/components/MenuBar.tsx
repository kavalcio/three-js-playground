import { Box, Typography } from '@mui/material';

export const MenuBar = ({
  onNewGame,
  setIsVictory,
  moveCount,
}: {
  onNewGame: () => void;
  setIsVictory: (arg: boolean) => void;
  moveCount: number;
}) => {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(21, 92, 0, 1)',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        p: 0.5,
        gap: 0.5,
        boxShadow:
          'rgba(0, 0, 0, 0.2) 0px 2px 4px -1px, rgba(0, 0, 0, 0.14) 0px 4px 5px 0px, rgba(0, 0, 0, 0.12) 0px 1px 10px 0px',
      }}
    >
      <Typography sx={{ fontSize: 13, mr: 1 }}>Moves: {moveCount}</Typography>
      <button onClick={onNewGame}>New Game</button>
      <button onClick={() => setIsVictory(true)}>Insta Win</button>
    </Box>
  );
};
