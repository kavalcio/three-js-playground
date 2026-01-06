import { Box } from '@mui/material';

export const VictoryScreen = ({
  onNewGame,
  moveCount,
}: {
  onNewGame: () => void;
  moveCount: number;
}) => {
  return (
    <>
      <Box
        sx={{
          width: 300,
          height: 200,
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
          border: '2px solid gray',
        }}
      >
        <span style={{ fontSize: 30 }}>YOU WIN!!!</span>
        <span>Moves: {moveCount}</span>
        <button style={{ width: 'fit-content' }} onClick={onNewGame}>
          new game
        </button>
      </Box>
    </>
  );
};
