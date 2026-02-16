import { Box } from '@mui/material';
import { useState } from 'react';

export const NewGameConfirmation = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: (stockStepSize: number) => void;
  onCancel: () => void;
}) => {
  const [stockStepSize, setStockStepSize] = useState(1);
  return (
    <Box
      sx={{
        width: 350,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
        border: '2px solid gray',
      }}
    >
      <span>Start new game?</span>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <Box sx={{ display: 'flex', gap: 2 }}>
          <div>
            <input
              type="radio"
              id="easy"
              value={1}
              checked={stockStepSize === 1}
              onChange={() => setStockStepSize(1)}
            />
            <label htmlFor="easy">Easy</label>
          </div>
          <div>
            <input
              type="radio"
              id="hard"
              value={3}
              checked={stockStepSize === 3}
              onChange={() => setStockStepSize(3)}
            />
            <label htmlFor="hard">Hard</label>
          </div>
        </Box>
        <span style={{ fontSize: 13, color: 'gray' }}>
          (Draw {stockStepSize} card{stockStepSize > 1 ? 's' : ''} at a time)
        </span>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <button onClick={onCancel}>cancel</button>
        <button onClick={() => onConfirm(stockStepSize)}>go!</button>
      </Box>
    </Box>
  );
};
