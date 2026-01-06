import { Box } from '@mui/material';

export const NewGameConfirmation = ({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) => {
  return (
    <Box
      sx={{
        width: 300,
        height: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        fontFamily: '"Comic Sans MS", "Comic Sans", cursive',
        border: '2px solid gray',
      }}
    >
      <span>Are you sure?</span>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <button onClick={onConfirm}>yes</button>
        <button onClick={onCancel}>no</button>
      </Box>
    </Box>
  );
};
